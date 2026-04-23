import { Bookmark, MangaSource } from "@/lib/supabase/type"

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

export const addLocalBookmark = (manga: MangaSource) => {
    const bookmarks = getLocalBookmarks()
    if (bookmarks.find((b) => b.id === manga.externalId)) return

    const newBookmark: LocalBookmark = {
        id: manga.externalId,
        read_status: "plan_to_read",
        score: null,
        updated_at: new Date().toISOString(),
        manga: [
            {
                id: manga.externalId,
                title: manga.title,
                source: manga.source,
                author: manga.author ?? undefined,
                cover_url: manga.coverUrl,
                total_chapters: manga.totalChapters ?? undefined,
            },
        ],
        reading_progress: [],
    }
    localStorage.setItem(
        KEY,
        JSON.stringify(
            [...bookmarks, newBookmark].sort(
                (a, b) =>
                    new Date(b.updated_at).getTime() -
                    new Date(a.updated_at).getTime(),
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
