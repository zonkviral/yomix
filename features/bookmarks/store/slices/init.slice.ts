import { getLocalBookmarks } from "../../services/local-storage"

import { Bookmark } from "@/lib/supabase/type"
import { StoreSet } from "../types"

export const createInitSlice = (set: StoreSet) => ({
    init: (isGuest: boolean, bookmarks?: Bookmark[]) => {
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
            })
        }
    },
})
