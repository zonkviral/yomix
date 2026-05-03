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
    if (bookmarks.find((b) => b.id === manga.id)) return
    const score = bookmarks.find((b) =>
        b.manga.manga_sources?.some((ms) => ms.external_id === manga.id),
    )?.score

    const newBookmark: LocalBookmark = {
        id: manga.id,
        read_status: "plan_to_read",
        score: score ?? undefined,
        updated_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        manga: {
            id: manga.id,
            title: manga.title,
            manga_sources: manga.manga_sources,
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
                (a, b) =>
                    new Date(b.created_at).getTime() -
                    new Date(a.created_at).getTime(),
            ),
        ),
    )
}

export const removeLocalBookmark = (mangaId: string) => {
    const bookmarks = getLocalBookmarks().filter((b) => b.id !== mangaId)
    localStorage.setItem(KEY, JSON.stringify(bookmarks))
}

export const updateLocalReadingProgress = (
    mangaId: string,
    chapterNumber: number,
) => {
    const bookmarks = getLocalBookmarks()
    const updated = bookmarks.map((b) => {
        if (b.id !== mangaId) return b
        const existing = b.manga.reading_progress.find(
            (p) => p.chapter_number === chapterNumber,
        )
        const newProgress = existing
            ? b.manga.reading_progress
            : [...b.manga.reading_progress, { chapter_number: chapterNumber }]

        return {
            ...b,
            updated_at: new Date().toISOString(),
            manga: {
                ...b.manga,
                reading_progress: newProgress.sort(
                    (a, b) => a.chapter_number - b.chapter_number,
                ),
            },
        }
    })
    localStorage.setItem(KEY, JSON.stringify(updated))
}
export const updateLocalReadStatus = (mangaId: string, status: string) => {
    const bookmarks = getLocalBookmarks()
    const updated = bookmarks.map((b) => {
        if (b.id !== mangaId) return b
        return {
            ...b,
            updated_at: new Date().toISOString(),
            read_status: status,
        }
    })
    localStorage.setItem(KEY, JSON.stringify(updated))
}

export const clearLocalBookmarks = () => localStorage.removeItem(KEY)
