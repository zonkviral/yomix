"use server"
import { updateTag } from "next/cache"
import { createClient } from "@/lib/supabase/server"

export const toggleCollectionAction = async (
    collectionId: string,
    mangaId: string,
    isInCollection?: boolean,
) => {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()
    if (!user) return { error: "Not authenticated" }

    const { error } = isInCollection
        ? await supabase
              .from("list_items")
              .delete()
              .eq("list_id", collectionId)
              .eq("manga_id", mangaId)
        : await supabase
              .from("list_items")
              .insert({ list_id: collectionId, manga_id: mangaId })

    if (error) return { error: error.message }

    updateTag(`collections-${user.id}`)
    return { success: true }
}
