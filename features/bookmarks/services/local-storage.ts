import { ChapterSource } from "@/lib/chapters/types"
import { Bookmark, Manga } from "@/lib/supabase/type"

const KEY = "local_bookmarks"

export type LocalBookmark = Bookmark
export const getLocalBookmarks = (): LocalBookmark[] => {
    if (typeof window === "undefined") return []
    try {
        return JSON.parse(localStorage.getItem(KEY) ?? "[]")
    } catch {
        return []
    }
}

export const addLocalBookmark = (manga: Manga) => {
    const bookmarks = getLocalBookmarks()
    if (bookmarks.some((b) => b.manga.external_id === manga.external_id)) return

    const newBookmark: LocalBookmark = {
        id: manga.external_id,
        read_status: "plan_to_read",
        score: undefined,
        updated_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        manga: {
            id: manga.id,
            external_id: manga.external_id,
            title: manga.title,
            titles: manga.titles,
            author: manga.author ?? undefined,
            cover_url: manga.cover_url,
            total_chapters: manga.total_chapters ?? undefined,
            reading_progress: [],
        },
    }
    localStorage.setItem(
        KEY,
        JSON.stringify(
            [...bookmarks, newBookmark].sort(
                (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
            ),
        ),
    )
}

export const removeLocalBookmark = (externalId: string) => {
    const bookmarks = getLocalBookmarks().filter((b) => b.manga.external_id !== externalId)
    localStorage.setItem(KEY, JSON.stringify(bookmarks))
}

export const updateLocalReadingProgress = (
    externalId: string,
    chapterId: string,
    chapterNumber: number,
    pageNumber: number,
    source: ChapterSource,
) => {
    const bookmarks = getLocalBookmarks()
    const updated = bookmarks.map((b) => {
        if (b.manga.external_id !== externalId) return b

        return {
            ...b,
            updated_at: new Date().toISOString(),
            manga: {
                ...b.manga,
                reading_progress: [
                    {
                        chapter_number: chapterNumber,
                        chapter_id: chapterId,
                        page_number: pageNumber,
                        source,
                    },
                ],
            },
        }
    })
    localStorage.setItem(KEY, JSON.stringify(updated))
}

export const updateLocalReadStatus = (externalId: string, status: string) => {
    const bookmarks = getLocalBookmarks()
    const updated = bookmarks.map((b) => {
        if (b.manga.external_id !== externalId) return b
        return {
            ...b,
            updated_at: new Date().toISOString(),
            read_status: status,
        }
    })
    localStorage.setItem(KEY, JSON.stringify(updated))
}

export const clearLocalBookmarks = () => localStorage.removeItem(KEY)
