"use server"

import { updateTag } from "next/cache"

import { createClient } from "@/lib/supabase/server"
import { resolveMangaId } from "@/lib/supabase/resolveMangaId"
import { READ_STATUSES } from "@/lib/supabase/constants"

import { ReadStatus } from "@/lib/supabase/type"
import { getUserId } from "@/lib/supabase/getUserId"

export const updateReadStatus = async (externalId: string, status: ReadStatus) => {
    if (!READ_STATUSES.includes(status)) return { error: "Invalid status" }

    const supabase = await createClient()
    const userId = await getUserId(supabase)

    if (!userId) return { error: "Not authenticated" }

    const mangaId = await resolveMangaId(supabase, externalId)
    if (!mangaId) return { error: "Manga not found" }

    const now = new Date().toISOString()
    const { error } = await supabase
        .from("bookmarks")
        .update({
            read_status: status,
            completed_at: status === "completed" ? now : null,
            ...(status === "reading" ? { started_at: now } : {}),
        })
        .eq("user_id", userId)
        .eq("manga_id", mangaId)

    if (error) return { error: error.message }

    updateTag(`status-counts-${userId}`)
    updateTag(`continue-reading-${userId}`)
    return { success: true }
}
