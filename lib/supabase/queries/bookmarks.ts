import { createClient } from "@/lib/supabase/server"
import { Bookmark } from "../type"

export const getUserBookmarks = async (userId: string): Promise<Bookmark[]> => {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from("bookmarks")
        .select(
            `
            id, read_status, score, updated_at,
            manga (id, title, cover_url, total_chapters),
            reading_progress (chapter_number)
        `,
        )
        .eq("user_id", userId)
        .order("updated_at", { ascending: false })

    if (error) return []
    return (data ?? []) as Bookmark[]
}

export const getUserBookmarkedIds = async (
    userId: string,
): Promise<Set<string>> => {
    const supabase = await createClient()

    const { data } = await supabase
        .from("bookmarks")
        .select("manga_sources!inner(external_id)")
        .eq("user_id", userId)

    const ids = new Set<string>()
    data?.forEach((b: { manga_sources?: { external_id: string }[] }) => {
        b.manga_sources?.forEach((s: { external_id: string }) =>
            ids.add(s.external_id),
        )
    })
    return ids
}
