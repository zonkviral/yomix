"use server"

import { updateTag } from "next/cache"

import { createClient } from "@/lib/supabase/server"

import { ReadStatus } from "@/lib/supabase/type"

export const updateReadStatus = async (mangaId: string, status: ReadStatus) => {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()
    if (!user) return { error: "Not authenticated" }

    const { error } = await supabase
        .from("bookmarks")
        .update({
            read_status: status,
            updated_at: new Date().toISOString(),
            completed_at:
                status === "completed" ? new Date().toISOString() : null,
            started_at:
                status === "reading" ? new Date().toISOString() : undefined,
        })
        .eq("user_id", user.id)
        .eq("manga_id", mangaId)

    if (error) return { error: error.message }
    updateTag(`status-counts-${user.id}`)
    updateTag(`continue-reading-${user.id}`)
    updateTag(`collection-${user.id}`)
    return { success: true }
}
