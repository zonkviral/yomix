"use server"

import { updateTag } from "next/cache"

import { ensureManga } from "@/features/manga/action/ensure-manga.action"

import { createClient } from "@/lib/supabase/server"

export const addBookmark = async (externalId: string) => {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()
    if (!user) return { error: "Not authenticated" }

    const manga = await ensureManga(externalId)
    if ("error" in manga) return { error: manga.error }

    const { data, error } = await supabase
        .from("bookmarks")
        .insert({ user_id: user.id, manga_id: manga.id, read_status: "plan_to_read" })
        .select(
            `id, read_status, score, updated_at,
             manga (id, cover_url, total_chapters, author, external_id)`,
        )
        .single()

    if (error) {
        if (error.code === "23505") return { error: "Already bookmarked" }
        return { error: error.message }
    }

    updateTag(`recently-added-${user.id}`)
    updateTag(`continue-reading-${user.id}`)
    updateTag(`collections-${user.id}`)
    updateTag(`status-counts-${user.id}`)

    return { success: true, data }
}
