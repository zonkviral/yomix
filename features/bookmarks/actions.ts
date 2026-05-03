"use server"

import { createClient } from "@/lib/supabase/server"
import type { Manga, ReadStatus } from "@/lib/supabase/type"

import type { LocalBookmark } from "./services/local-storage"

export const updateReadStatus = async (mangaId: string, status: ReadStatus) => {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()
    if (!user) return { error: "Not authenticated" }

    const { error } = await supabase
        .from("bookmarks")
        .update({
            read_status: status,
            updated_at: new Date().toISOString(),
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

export const addBookmark = async (manga: Manga) => {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) return { error: "Not authenticated" }

    const sourceData = manga.manga_sources[0]

    const { data: existingSource } = await supabase
        .from("manga_sources")
        .select("manga_id")
        .eq("external_id", sourceData.external_id)
        .eq("source", sourceData.source)
        .single()

    let mangaId = existingSource?.manga_id

    if (!mangaId) {
        const { data: newManga, error: mangaError } = await supabase
            .from("manga")
            .insert({
                title: manga.title,
                cover_url: manga.cover_url,
                total_chapters: manga.total_chapters,
                author: manga.author,
            })
            .select("id")
            .single()

        if (mangaError) return { error: mangaError.message }
        mangaId = newManga.id

        await supabase.from("manga_sources").insert({
            manga_id: mangaId,
            source: sourceData.source,
            external_id: sourceData.external_id,
        })
    } else {
        await supabase
            .from("manga")
            .update({
                title: manga.title,
                cover_url: manga.cover_url,
                total_chapters: manga.total_chapters,
                author: manga.author,
            })
            .eq("id", mangaId)
    }

    const { data: bookmarkData, error: bookmarkError } = await supabase
        .from("bookmarks")
        .insert({
            user_id: user.id,
            manga_id: mangaId,
            read_status: "plan_to_read",
        })
        .select(
            `
            id, read_status, score, updated_at,
            manga (
                id, title, cover_url, total_chapters, author, 
                reading_progress(chapter_number),
                manga_sources(source, external_id)
            )
        `,
        )
        .single()

    if (bookmarkError) {
        if (bookmarkError.code === "23505")
            return { error: "Already bookmarked" }
        return { error: bookmarkError.message }
    }

    return { success: true, data: bookmarkData }
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
