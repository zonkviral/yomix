import { ChapterSource } from "@/lib/chapters/types"
import { Bookmark, Collection, Manga, ReadStatus } from "@/lib/supabase/type"

export interface BookmarksStore {
    bookmarks: Bookmark[]
    collections: Collection[]
    continueReading: Bookmark[]
    recentlyAdded: Bookmark[]
    statusCounts: Record<string, number>
    stats: { total_chapters: number } | null
    isGuest: boolean
    toggling: Set<string>
    activeBookmark: Bookmark | null

    init: (
        isGuest: boolean,
        bookmarks?: Bookmark[],
        collections?: Collection[],
        sidebarData?: {
            continueReading?: Bookmark[]
            recentlyAdded?: Bookmark[]
            statusCounts?: Record<string, number>
            stats?: { total_chapters: number } | null
        },
    ) => void
    hydrateActiveBookmark: (bookmark: Bookmark | null) => void
    mutateBookmarks: (() => void) | null
    setMutateBookmarks: (fn: () => void) => void
    isBookmarked: (externalId: string) => boolean
    getByExternalId: (externalId: string) => Bookmark | undefined
    toggle: (externalId: string, manga: Manga) => Promise<void>
    updateStatus: (externalId: string, status: ReadStatus) => Promise<void>
    remove: (externalId: string) => Promise<void>
    saveProgress: (
        externalId: string,
        chapterId: string,
        chapterNumber: number,
        pageNumber: number,
        source: ChapterSource,
    ) => Promise<void>
    createCollection: (
        name: string,
        icon: string,
        color: string,
        isPublic?: boolean,
    ) => Promise<{ error?: string; id?: string }>
    updateCollection: (
        id: string,
        name: string,
        icon: string,
        color: string,
        isPublic: boolean,
    ) => Promise<{ error?: string }>
    toggleCollection: (collectionId: string, externalId: string) => Promise<{ error?: string }>
    removeCollection: (collectionId: string) => Promise<{ error?: string }>
    reorderCollections: (reordered: Collection[]) => Promise<void>
}

export type StoreSet = (
    partial: Partial<BookmarksStore> | ((s: BookmarksStore) => Partial<BookmarksStore>),
) => void

export type StoreGet = () => BookmarksStore
