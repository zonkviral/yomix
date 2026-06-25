"use server"

import { updateTag } from "next/cache"
import { createClient } from "@/lib/supabase/server"

export const removeBookmark = async (mangaId: string) => {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()
    if (!user) return { error: "Not authenticated" }

    await supabase.from("list_items").delete().eq("manga_id", mangaId)

    const { error } = await supabase
        .from("bookmarks")
        .delete()
        .eq("user_id", user.id)
        .eq("manga_id", mangaId)

    if (error) return { error: error.message }

    updateTag(`recently-added-${user.id}`)
    updateTag(`continue-reading-${user.id}`)
    updateTag(`collections-${user.id}`)
    updateTag(`status-counts-${user.id}`)
    return { success: true }
}
