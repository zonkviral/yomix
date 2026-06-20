import { createClient } from "../server"
import { Bookmark } from "../type"

export const getContinueReading = async (
    userId: string,
): Promise<Bookmark[]> => {
    const supabase = await createClient()

    const { data: progressData } = await supabase
        .from("reading_progress")
        .select("manga_id, chapter_id, chapter_number, page_number")
        .eq("user_id", userId)
        .order("updated_at", { ascending: false })
        .limit(10)

    if (!progressData?.length) return []

    const mangaIds = progressData.map((p) => p.manga_id)

    const { data } = await supabase
        .from("bookmarks")
        .select(
            `
            id, read_status, created_at, updated_at,
            manga (
                id, title, cover_url, total_chapters, author,
                manga_sources (id, source, external_id)
            )
        `,
        )
        .eq("user_id", userId)
        .in("manga_id", mangaIds)

    return mangaIds
        .map((mangaId) => {
            const bookmark = (data ?? []).find((b) => b.manga.id === mangaId)
            const progress = progressData.find((p) => p.manga_id === mangaId)
            if (!bookmark || !progress) return null
            return {
                ...bookmark,
                manga: {
                    ...bookmark.manga,
                    reading_progress: [progress],
                },
            }
        })
        .filter(Boolean) as unknown as Bookmark[]
}
