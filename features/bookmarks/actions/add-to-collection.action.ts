"use server"

import { createClient } from "@/lib/supabase/server"

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
