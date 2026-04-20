"use server"

import { createClient } from "@/lib/supabase/server"
import type { LocalBookmark } from "@/lib/bookmarks/local"

export const updateReadStatus = async (
    mangaId: string,
    status: "reading" | "completed" | "plan_to_read" | "dropped" | "on_hold",
) => {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()
    if (!user) return { error: "Not authenticated" }

    const { error } = await supabase
        .from("bookmarks")
        .update({
            read_status: status,
            completed_at:
                status === "completed" ? new Date().toISOString() : null,
            started_at:
                status === "reading" ? new Date().toISOString() : undefined,
        })
        .eq("user_id", user.id)
        .eq("manga_id", mangaId)

    if (error) return { error: error.message }
    return { success: true }
}

export const updateScore = async (mangaId: string, score: number) => {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()
    if (!user) return { error: "Not authenticated" }

    const { error } = await supabase
        .from("bookmarks")
        .update({ score })
        .eq("user_id", user.id)
        .eq("manga_id", mangaId)

    if (error) return { error: error.message }
    return { success: true }
}

// collections
export const createCollection = async (name: string, isPublic = false) => {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()
    if (!user) return { error: "Not authenticated" }

    const { error } = await supabase
        .from("lists")
        .insert({ user_id: user.id, name, is_public: isPublic })

    if (error) return { error: error.message }
    return { success: true }
}

export const addToCollection = async (listId: string, mangaId: string) => {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()
    if (!user) return { error: "Not authenticated" }

    const { error } = await supabase
        .from("list_items")
        .insert({ list_id: listId, manga_id: mangaId })

    if (error) return { error: error.message }
    return { success: true }
}

export const migrateLocalBookmarks = async (bookmarks: LocalBookmark[]) => {
    if (!bookmarks.length) return { success: true }

    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()
    if (!user) return { error: "Not authenticated" }

    const externalIds = bookmarks.map((b) => b.id)

    const { data: mangaSources } = await supabase
        .from("manga_sources")
        .select("manga_id, external_id")
        .in("external_id", externalIds)
        .eq("source", "mangadex")

    const idMap = Object.fromEntries(
        (mangaSources ?? []).map((s) => [s.external_id, s.manga_id]),
    )

    const missing = bookmarks.filter((b) => !idMap[b.id])

    await Promise.all(
        missing.map(async (b) => {
            const manga = b.manga[0]
            const { data: newManga } = await supabase
                .from("manga")
                .insert({
                    title: manga.title,
                    cover_url: manga.cover_url,
                    total_chapters: manga.total_chapters,
                })
                .select("id")
                .single()

            if (newManga) {
                await supabase.from("manga_sources").insert({
                    manga_id: newManga.id,
                    source: "mangadex",
                    external_id: b.id,
                })
                idMap[b.id] = newManga.id
            }
        }),
    )

    const toUpsert = bookmarks
        .filter((b) => idMap[b.id])
        .map((b) => ({
            user_id: user.id,
            manga_id: idMap[b.id],
            read_status: b.read_status,
            score: b.score,
            created_at: b.updated_at,
        }))

    if (!toUpsert.length) return { success: true }

    const { error } = await supabase
        .from("bookmarks")
        .upsert(toUpsert, { onConflict: "user_id,manga_id" })

    if (error) return { error: error.message }

    for (const b of bookmarks) {
        const mangaId = idMap[b.id]
        if (!mangaId || !b.reading_progress.length) continue

        await supabase.from("reading_progress").upsert(
            b.reading_progress.map((p) => ({
                user_id: user.id,
                manga_id: mangaId,
                chapter_number: p.chapter_number,
            })),
            { onConflict: "user_id,manga_id,chapter_number" },
        )
    }

    return { success: true }
}

export const addBookmark = async (manga: {
    externalId: string
    source: string
    title: string
    coverUrl: string
    totalChapters?: number
}) => {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()
    if (!user) return { error: "Not authenticated" }

    const { data: existing } = await supabase
        .from("manga_sources")
        .select("manga_id")
        .eq("source", manga.source)
        .eq("external_id", manga.externalId)
        .single()

    let mangaId = existing?.manga_id

    if (!mangaId) {
        const { data: newManga, error: mangaError } = await supabase
            .from("manga")
            .insert({
                title: manga.title,
                cover_url: manga.coverUrl,
                total_chapters: manga.totalChapters,
            })
            .select("id")
            .single()

        if (mangaError) return { error: mangaError.message }
        mangaId = newManga.id

        await supabase.from("manga_sources").insert({
            manga_id: mangaId,
            source: manga.source,
            external_id: manga.externalId,
            url: `https://mangadex.org/title/${manga.externalId}`,
        })
    }

    const { error } = await supabase
        .from("bookmarks")
        .insert({ user_id: user.id, manga_id: mangaId })

    if (error) return { error: error.message }
    return { success: true }
}

export const removeBookmark = async (mangaId: string) => {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()
    if (!user) return { error: "Not authenticated" }

    const { error } = await supabase
        .from("bookmarks")
        .delete()
        .eq("user_id", user.id)
        .eq("manga_id", mangaId)

    if (error) return { error: error.message }
    return { success: true }
}
