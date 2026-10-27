"use server"

import { updateTag } from "next/cache"

import { createClient } from "@/lib/supabase/server"
import { resolveMangaId } from "@/lib/supabase/resolveMangaId"
import { getUserId } from "@/lib/supabase/getUserId"

export const removeBookmark = async (externalId: string) => {
    const supabase = await createClient()
    const userId = await getUserId(supabase)

    if (!userId) return { error: "Not authenticated" }

    const mangaId = await resolveMangaId(supabase, externalId)
    if (!mangaId) return { error: "Manga not found" }

    await supabase.from("collection_items").delete().eq("manga_id", mangaId)

    const { error } = await supabase
        .from("bookmarks")
        .delete()
        .eq("user_id", userId)
        .eq("manga_id", mangaId)

    if (error) return { error: error.message }

    updateTag(`recently-added-${userId}`)
    updateTag(`continue-reading-${userId}`)
    updateTag(`collections-${userId}`)
    updateTag(`status-counts-${userId}`)
    return { success: true }
}
