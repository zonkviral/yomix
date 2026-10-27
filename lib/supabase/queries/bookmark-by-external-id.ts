import { createClient } from "../server"

import { Bookmark } from "../type"

export const getBookmarkByExternalId = async (userId: string, externalId: string) => {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from("bookmarks")
        .select(
            `
            id, read_status, score, started_at, completed_at, created_at, updated_at,
            manga!inner (
                id, external_id, cover_url, total_chapters, author, status,
                reading_progress (chapter_id, chapter_number, page_number, source)
            )
        `,
        )
        .eq("user_id", userId)
        .eq("manga.external_id", externalId)
        .maybeSingle()

    if (error) console.error("getBookmarkByExternalId error:", error.message)
    return data as unknown as Bookmark | null
}
