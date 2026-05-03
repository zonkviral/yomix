"use server"

import { createClient } from "@/lib/supabase/server"

import { LocalBookmark } from "../services/local-storage"

export const migrateLocalBookmarks = async (bookmarks: LocalBookmark[]) => {
    if (!bookmarks.length) return { success: true }

    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()
    if (!user) return { error: "Not authenticated" }

    const externalIds = bookmarks.map((b) => b.id)

    // 1. Get existing sources
    const { data: mangaSources } = await supabase
        .from("manga_sources")
        .select("manga_id, external_id")
        .in("external_id", externalIds)

    const idMap = Object.fromEntries(
        (mangaSources ?? []).map((s) => [s.external_id, s.manga_id]),
    )

    // 2. Handle missing OR incomplete manga (like missing authors)
    await Promise.all(
        bookmarks.map(async (b) => {
            const internalId = idMap[b.id]
            const mangaData = {
                title: b.manga.title,
                cover_url: b.manga.cover_url,
                total_chapters: b.manga.total_chapters,
                author: b.manga.author, // <--- This fixes your author issue!
            }

            if (!internalId) {
                // INSERT NEW
                const { data: newManga } = await supabase
                    .from("manga")
                    .insert(mangaData)
                    .select("id")
                    .single()

                if (newManga) {
                    await supabase.from("manga_sources").insert({
                        manga_id: newManga.id,
                        source: b.manga.manga_sources[0].source,
                        external_id: b.id,
                    })
                    idMap[b.id] = newManga.id
                }
            } else {
                console.log(
                    `Updating existing manga (ID: ${internalId}) with latest data from bookmark.`,
                )
                // UPDATE EXISTING (To ensure author/cover are up to date)
                await supabase
                    .from("manga")
                    .update(mangaData)
                    .eq("id", internalId)
            }
        }),
    )

    // 3. Upsert Bookmarks
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
        await supabase
            .from("bookmarks")
            .upsert(toUpsert, { onConflict: "user_id,manga_id" })
    }

    // 4. Upsert Reading Progress (FIXED THE ID BUG HERE)
    const progressData = bookmarks
        .filter((b) => idMap[b.id] && b.manga.reading_progress?.length)
        .flatMap((b) =>
            b.manga.reading_progress.map((p) => ({
                user_id: user.id,
                manga_id: idMap[b.id], // <--- USE idMap[b.id] (UUID), NOT b.id (External)
                chapter_number: p.chapter_number,
            })),
        )

    if (progressData.length > 0) {
        await supabase.from("reading_progress").upsert(progressData, {
            onConflict: "user_id,manga_id,chapter_number",
        })
    }

    return { success: true }
}
