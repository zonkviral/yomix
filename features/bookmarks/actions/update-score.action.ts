"use server"

import { createClient } from "@/lib/supabase/server"
import { resolveMangaId } from "@/lib/supabase/resolveMangaId"
import { getUserId } from "@/lib/supabase/getUserId"

export const updateScore = async (externalId: string, score: number | null) => {
    if (score !== null && (!Number.isInteger(score) || score < 1 || score > 10)) {
        return { error: "Invalid score" }
    }

    const supabase = await createClient()
    const userId = await getUserId(supabase)

    if (!userId) return { error: "Not authenticated" }

    const mangaId = await resolveMangaId(supabase, externalId)
    if (!mangaId) return { error: "Manga not found" }

    const { error } = await supabase
        .from("bookmarks")
        .update({ score })
        .eq("user_id", userId)
        .eq("manga_id", mangaId)

    if (error) return { error: error.message }
    return { success: true }
}
