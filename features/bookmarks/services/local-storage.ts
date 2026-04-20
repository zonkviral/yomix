import { Bookmark } from "../supabase/type"

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

export const addLocalBookmark = (manga: {
    mangaId: string
    title: string
    coverUrl: string
    totalChapters?: number
}) => {
    const bookmarks = getLocalBookmarks()
    if (bookmarks.find((b) => b.id === manga.mangaId)) return

    const newBookmark: LocalBookmark = {
        id: manga.mangaId,
        read_status: "plan_to_read",
        score: null,
        updated_at: new Date().toISOString(),
        manga: [
            {
                id: manga.mangaId,
                title: manga.title,
                cover_url: manga.coverUrl,
                total_chapters: manga.totalChapters ?? null,
            },
        ],
        reading_progress: [],
    }

    localStorage.setItem(KEY, JSON.stringify([...bookmarks, newBookmark]))
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
        const existing = b.reading_progress.find(
            (p) => p.chapter_number === chapterNumber,
        )
        const newProgress = existing
            ? b.reading_progress
            : [...b.reading_progress, { chapter_number: chapterNumber }]

        return {
            ...b,
            updated_at: new Date().toISOString(),
            reading_progress: newProgress.sort(
                (a, b) => a.chapter_number - b.chapter_number,
            ),
        }
    })
    localStorage.setItem(KEY, JSON.stringify(updated))
}

export const clearLocalBookmarks = () => localStorage.removeItem(KEY)
