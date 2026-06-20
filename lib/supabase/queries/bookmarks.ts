import { createClient } from "@/lib/supabase/server"
import { Bookmark } from "../type"
import { PAGE_SIZE } from "./bookmarks.constants"

export interface BookmarkFilters {
    q?: string
    status?: string
    collectionId?: string
    sort?: string
    page?: number
}

export interface BookmarksResult {
    data: Bookmark[]
    count: number
}

export const getUserBookmarks = async (
    userId: string,
    filters: BookmarkFilters = {},
): Promise<BookmarksResult> => {
    const {
        q,
        status,
        sort = "created_at:desc",
        collectionId,
        page = 0,
    } = filters

    const supabase = await createClient()
    const [sortBy, sortDir] = sort.split(":") as [string, "asc" | "desc"]

    let collectionMangaIds: string[] | null = null
    if (collectionId) {
        const { data } = await supabase
            .from("list_items")
            .select("manga_id")
            .eq("list_id", collectionId)
        collectionMangaIds = data?.map((i) => i.manga_id) ?? []
        if (collectionMangaIds.length === 0) return { data: [], count: 0 }
    }

    let query = supabase
        .from("bookmarks")
        .select(
            `
            id, read_status, score, updated_at, created_at, completed_at, started_at,
            manga (
                id, title, cover_url, total_chapters, author,
                manga_sources (id, source, external_id),
                reading_progress (chapter_id, chapter_number, page_number)
            )
        `,
            { count: "exact" },
        )
        .eq("user_id", userId)

    if (!collectionId && status && status !== "all") {
        query = query.eq("read_status", status)
    }
    if (collectionMangaIds) {
        query = query.in("manga_id", collectionMangaIds)
    }

    if (q) {
        const { data: mangaData } = await supabase
            .from("manga")
            .select("id")
            .ilike("title", `%${q.trim()}%`)

        const ids = mangaData?.map((m) => m.id) ?? []
        if (ids.length === 0) return { data: [], count: 0 }
        query = query.in("manga_id", ids)
    }

    const dbSort = sortBy === "title" ? "created_at" : sortBy
    query = query
        .order(dbSort, { ascending: sortDir === "asc" })
        .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1)

    const { data, error, count } = await query
    if (error) console.error("getUserBookmarks error:", error.message)

    let result = (data ?? []) as unknown as Bookmark[]
    if (sortBy === "title") {
        result = result.sort((a, b) =>
            a.manga.title.localeCompare(b.manga.title, "ru"),
        )
    }

    return { data: result, count: count ?? 0 }
}
