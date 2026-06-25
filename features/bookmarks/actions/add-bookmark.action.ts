"use server"

import { updateTag } from "next/cache"

import { createClient } from "@/lib/supabase/server"

import { Manga } from "@/lib/supabase/type"

export const addBookmark = async (manga: Manga) => {
    const sourceData = manga.manga_sources[0]
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) return { error: "Not authenticated" }

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
    updateTag(`recently-added-${user.id}`)
    updateTag(`continue-reading-${user.id}`)
    updateTag(`collection-${user.id}`)
    updateTag(`status-counts-${user.id}`)

    return { success: true, data: bookmarkData }
}
