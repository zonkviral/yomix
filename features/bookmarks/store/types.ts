import { Bookmark, Collection, Manga, ReadStatus } from "@/lib/supabase/type"

export interface BookmarksStore {
    bookmarks: Bookmark[]
    collections: Collection[]
    isGuest: boolean
    hydrated: boolean
    toggling: Set<string>

    init: (
        isGuest: boolean,
        bookmarks?: Bookmark[],
        collections?: Collection[],
    ) => void
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
    createCollection: (
        name: string,
        icon: string,
        color: string,
        isPublic?: boolean,
    ) => Promise<{ error?: string }>
    updateCollection: (
        id: string,
        name: string,
        icon: string,
        color: string,
        isPublic: boolean,
    ) => Promise<{ error?: string }>

    removeCollection: (collectionId: string) => Promise<{ error?: string }>
    reorderCollections: (reordered: Collection[]) => Promise<void>
}

export type StoreSet = (
    partial:
        | Partial<BookmarksStore>
        | ((s: BookmarksStore) => Partial<BookmarksStore>),
) => void

export type StoreGet = () => BookmarksStore
