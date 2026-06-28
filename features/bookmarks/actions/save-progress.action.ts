"use server"

import { revalidatePath, updateTag } from "next/cache"

import { createClient } from "@/lib/supabase/server"
import { createServiceClient } from "@/lib/supabase/service"

type ProgressPayload = {
    externalId: string
    chapterId: string
    chapterNumber: number
    pageNumber: number
}

export const saveProgress = async (payload: ProgressPayload) => {
    const supabase = await createClient()
    const supabaseAdmin = createServiceClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()
    if (!user) return { error: "Not authenticated" }

    const { data: source } = await supabaseAdmin
        .from("manga_sources")
        .select("manga_id")
        .eq("external_id", payload.externalId)
        .single()

    if (!source?.manga_id) return { error: "Manga not found in sources" }

    const { error } = await supabase.from("reading_progress").upsert(
        {
            user_id: user.id,
            manga_id: source.manga_id,
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
