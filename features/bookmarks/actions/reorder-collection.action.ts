"use server"

import { updateTag } from "next/cache"

import { createClient } from "@/lib/supabase/server"

export const reorderCollectionsAction = async (
    items: { id: string; position: number }[],
) => {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()
    if (!user) return { error: "Not authenticated" }

    const results = await Promise.all(
        items.map(({ id, position }) =>
            supabase
                .from("lists")
                .update({ position })
                .eq("id", id)
                .eq("user_id", user.id),
        ),
    )

    const error = results.find((r) => r.error)?.error
    if (error) return { error: error.message }
    updateTag(`collections-${user.id}`)
    return { success: true }
}
