"use server"

import { createClient } from "@/lib/supabase/server"
import { LocalBookmark } from "../services/local-storage"

import { createServiceClient } from "@/lib/supabase/service"

export const migrateLocalBookmarks = async (bookmarks: LocalBookmark[]) => {
    if (!bookmarks.length) return { success: true }

    const supabase = await createClient()
    const supabaseAdmin = createServiceClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()
    if (!user) return { error: "Not authenticated" }

    const externalIds = bookmarks.map((b) => b.id)

    const { data: mangaSources } = await supabaseAdmin
        .from("manga_sources")
        .select("manga_id, external_id")
        .in("external_id", externalIds)

    const idMap: Record<string, string> = Object.fromEntries(
        (mangaSources ?? []).map((s) => [s.external_id, s.manga_id]),
    )

    for (const b of bookmarks) {
        const internalId = idMap[b.id]

        const mangaData = {
            title: b.manga.title,
            cover_url: b.manga.cover_url,
            total_chapters: b.manga.total_chapters,
            author: b.manga.author,
        }

        if (!internalId) {
            const { data: newManga, error } = await supabaseAdmin
                .from("manga")
                .insert(mangaData)
                .select("id")
                .single()

            if (error) {
                console.error(`Failed to insert manga ${b.id}:`, error.message)
                continue
            }

            if (newManga) {
                await supabaseAdmin.from("manga_sources").insert({
                    manga_id: newManga.id,
                    source: b.manga.manga_sources[0].source,
                    external_id: b.id,
                })
                idMap[b.id] = newManga.id
            }
        } else {
            await supabaseAdmin
                .from("manga")
                .update(mangaData)
                .eq("id", internalId)
        }
    }

    const toUpsert = bookmarks
        .filter((b) => idMap[b.id])
        .map((b) => ({
            user_id: user.id,
            manga_id: idMap[b.id],
            read_status: b.read_status,
            score: b.score,
            updated_at: b.updated_at,
            created_at: b.created_at,
        }))

    if (toUpsert.length > 0) {
        const { error } = await supabase
            .from("bookmarks")
            .upsert(toUpsert, { onConflict: "user_id,manga_id" })

        if (error) console.error("Failed to upsert bookmarks:", error.message)
    }

    const progressData = bookmarks
        .filter((b) => idMap[b.id] && b.manga.reading_progress?.length)
        .map((b) => ({
            user_id: user.id,
            manga_id: idMap[b.id],
            chapter_id: b.manga.reading_progress[0].chapter_id,
            chapter_number: b.manga.reading_progress[0].chapter_number,
            page_number: b.manga.reading_progress[0].page_number,
        }))

    if (progressData.length > 0) {
        const { error } = await supabase
            .from("reading_progress")
            .upsert(progressData, { onConflict: "user_id,manga_id" })

        if (error) console.error("Failed to upsert progress:", error.message)
    }

    return { success: true }
}
