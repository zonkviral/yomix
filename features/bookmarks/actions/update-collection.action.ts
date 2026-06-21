"use server"

import { updateTag } from "next/cache"

import { createClient } from "@/lib/supabase/server"

export const updateCollection = async (
    id: string,
    name: string,
    icon: string,
    color: string,
    isPublic: boolean,
) => {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()
    if (!user) return { error: "Not authenticated" }
    const { error } = await supabase
        .from("lists")
        .update({ name, icon, color, is_public: isPublic })
        .eq("id", id)

    if (error) return { error: error.message }
    updateTag(`collections-${user.id}`)
    return { success: true }
}
