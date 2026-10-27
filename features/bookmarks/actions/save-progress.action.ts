"use server"

import { revalidatePath, updateTag } from "next/cache"

import { createClient } from "@/lib/supabase/server"
import { createServiceClient } from "@/lib/supabase/service"
import { getUserId } from "@/lib/supabase/getUserId"
import { ChapterSource } from "@/lib/chapters/types"

type ProgressPayload = {
    externalId: string
    chapterId: string
    chapterNumber: number
    pageNumber: number
    source: ChapterSource
}

export const saveProgress = async (payload: ProgressPayload) => {
    const supabase = await createClient()
    const supabaseAdmin = createServiceClient()
    const userId = await getUserId(supabase)

    if (!userId) return { error: "Not authenticated" }

    const { data: manga } = await supabaseAdmin
        .from("manga")
        .select("id")
        .eq("external_id", payload.externalId)
        .single()

    if (!manga?.id) return { error: "Manga not found" }

    const { error } = await supabase.from("reading_progress").upsert(
        {
            user_id: userId,
            manga_id: manga.id,
            chapter_id: payload.chapterId,
            chapter_number: payload.chapterNumber,
            page_number: payload.pageNumber,
            source: payload.source,
        },
        { onConflict: "user_id, manga_id" },
    )

    if (error) return { error: error.message }

    updateTag(`continue-reading-${userId}`)
    revalidatePath("/bookmarks")
    return { success: true }
}
