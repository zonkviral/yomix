"use server"

import { createClient } from "@/lib/supabase/server"

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
