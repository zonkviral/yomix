import { createClient } from "@/lib/supabase/server"
import { Bookmark } from "../type"

export const getUserBookmarks = async (userId: string): Promise<Bookmark[]> => {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from("bookmarks")
        .select(
            `
            id, read_status, score, updated_at, created_at, completed_at, started_at,
            manga (
                id, title, manga_sources (source, external_id), cover_url, total_chapters, author,
                reading_progress (chapter_number)
            )
        `,
        )
        .eq("user_id", userId)
        .order("created_at", { ascending: false })

    if (error) {
        console.error("SUPABASE ERROR:", error.message)
    }

    console.log("Fetched bookmarks:", data)
    return (data ?? []) as unknown as Bookmark[]
}

export const getUserBookmarkedIds = async (
    userId: string,
): Promise<Set<string>> => {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from("bookmarks")
        .select(
            `
            manga!inner (
                manga_sources (
                    external_id
                )
            )
        `,
        )
        .eq("user_id", userId)

    if (error) {
        console.error("SUPABASE ERROR (Bookmarked IDs):", error.message)
        return new Set()
    }

    const ids = new Set<string>()

    data?.forEach(
        (item: { manga: { manga_sources: { external_id: string }[] }[] }) => {
            item.manga?.forEach((manga) => {
                manga.manga_sources?.forEach(
                    (source: { external_id: string }) => {
                        if (source.external_id) {
                            ids.add(source.external_id)
                        }
                    },
                )
            })
        },
    )

    return ids
}
