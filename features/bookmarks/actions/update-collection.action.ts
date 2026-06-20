"use server"

import { createClient } from "@/lib/supabase/server"

export const updateCollection = async (
    id: string,
    name: string,
    icon: string,
    color: string,
    isPublic: boolean,
) => {
    const supabase = await createClient()
    const { error } = await supabase
        .from("lists")
        .update({ name, icon, color, is_public: isPublic })
        .eq("id", id)

    if (error) return { error: error.message }
    return { success: true }
}
