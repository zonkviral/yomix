import { getLocalBookmarks } from "../../services/local-storage"

import { Bookmark, Collection } from "@/lib/supabase/type"
import { StoreSet } from "../types"

export const createInitSlice = (set: StoreSet) => ({
    init: (
        isGuest: boolean,
        bookmarks?: Bookmark[],
        collections?: Collection[],
    ) => {
        if (isGuest) {
            set({
                isGuest: true,
                hydrated: true,
                bookmarks: getLocalBookmarks(),
            })
        } else {
            set({
                isGuest: false,
                hydrated: true,
                bookmarks: bookmarks ?? [],
                collections: collections ?? [],
            })
        }
    },
})
