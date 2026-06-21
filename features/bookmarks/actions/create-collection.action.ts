"use server"

import { updateTag } from "next/cache"

import { createClient } from "@/lib/supabase/server"

export const createCollection = async (
    name: string,
    icon: string,
    color: string,
    isPublic = false,
) => {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()
    if (!user) return { error: "Not authenticated" }

    const { data: existing } = await supabase
        .from("lists")
        .select("position")
        .eq("user_id", user.id)
        .order("position", { ascending: false })
        .limit(1)
        .single()

    const nextPosition = (existing?.position ?? -1) + 1

    const { data, error } = await supabase
        .from("lists")
        .insert({
            user_id: user.id,
            name,
            icon,
            color,
            is_public: isPublic,
            position: nextPosition,
        })
        .select("id")
        .single()

    if (error) return { error: error.message }
    updateTag(`collections-${user.id}`)
    return { success: true, id: data.id }
}
