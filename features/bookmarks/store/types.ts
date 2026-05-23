import { Bookmark, Manga, ReadStatus } from "@/lib/supabase/type"

export interface BookmarksStore {
    bookmarks: Bookmark[]
    isGuest: boolean
    hydrated: boolean
    toggling: Set<string>

    init: (isGuest: boolean, bookmarks?: Bookmark[]) => void
    isBookmarked: (externalId: string) => boolean
    getByExternalId: (externalId: string) => Bookmark | undefined
    toggle: (externalId: string, manga: Manga) => Promise<void>
    updateStatus: (mangaId: string, status: ReadStatus) => Promise<void>
    remove: (externalId: string) => Promise<void>
    saveProgress: (
        mangaId: string,
        chapterId: string,
        chapterNumber: number,
        pageNumber: number,
    ) => Promise<void>
}

export type StoreSet = (
    partial:
        | Partial<BookmarksStore>
        | ((s: BookmarksStore) => Partial<BookmarksStore>),
) => void

export type StoreGet = () => BookmarksStore
