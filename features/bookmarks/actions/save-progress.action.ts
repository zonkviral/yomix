"use server"

import { revalidatePath, updateTag } from "next/cache"

import { createClient } from "@/lib/supabase/server"

type ProgressPayload = {
    mangaId: string
    chapterId: string
    chapterNumber: number
    pageNumber: number
}

export const saveProgress = async (payload: ProgressPayload) => {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()
    if (!user) return { error: "Not authenticated" }

    const { error } = await supabase.from("reading_progress").upsert(
        {
            user_id: user.id,
            manga_id: payload.mangaId,
            chapter_id: payload.chapterId,
            chapter_number: payload.chapterNumber,
            page_number: payload.pageNumber,
        },
        { onConflict: "user_id,manga_id" },
    )

    if (error) return { error: error.message }
    updateTag(`continue-reading-${user.id}`)
    revalidatePath("/bookmarks")
    return { success: true }
}
