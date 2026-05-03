"use server"

import { createClient } from "@/lib/supabase/server"

export const createCollection = async (name: string, isPublic = false) => {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()
    if (!user) return { error: "Not authenticated" }

    const { error } = await supabase
        .from("lists")
        .insert({ user_id: user.id, name, is_public: isPublic })

    if (error) return { error: error.message }
    return { success: true }
}
