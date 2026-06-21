"use server"

import { createClient } from "@/lib/supabase/server"

import { updateTag } from "next/cache"

export const removeCollection = async (collectionId: string) => {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()
    if (!user) return { error: "Not authenticated" }

    const { error } = await supabase
        .from("lists")
        .delete()
        .eq("id", collectionId)
        .eq("user_id", user.id)

    if (error) return { error: error.message }
    updateTag(`collections-${user.id}`)
    return { success: true }
}
