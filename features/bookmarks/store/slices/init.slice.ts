import { getLocalBookmarks } from "../../services/local-storage"
import { Bookmark, Collection } from "@/lib/supabase/type"
import { StoreSet } from "../types"

export const createInitSlice = (set: StoreSet) => ({
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
    ) => {
        if (isGuest) {
            set({
                isGuest: true,
                bookmarks: getLocalBookmarks(),
            })
        } else {
            set({
                isGuest: false,
                bookmarks: bookmarks ?? [],
                collections: collections ?? [],
                continueReading: sidebarData?.continueReading ?? [],
                recentlyAdded: sidebarData?.recentlyAdded ?? [],
                statusCounts: sidebarData?.statusCounts ?? {},
                stats: sidebarData?.stats ?? null,
            })
        }
    },
})
