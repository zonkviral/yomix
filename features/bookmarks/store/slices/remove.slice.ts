import { removeBookmark } from "../../actions"
import { removeLocalBookmark } from "../../services/local-storage"

import { findByExternalId, filterByExternalId } from "../helpers"

import { StoreSet, StoreGet } from "../types"

export const createRemoveSlice = (set: StoreSet, get: StoreGet) => ({
    remove: async (externalId: string) => {
        const { isGuest, bookmarks } = get()
        const internalId = findByExternalId(bookmarks, externalId)?.manga.id

        set((s) => ({
            bookmarks: filterByExternalId(s.bookmarks, externalId),
        }))

        if (isGuest) {
            removeLocalBookmark(externalId)
            return
        }

        if (!internalId) {
            set({ bookmarks })
            return
        }

        const result = await removeBookmark(internalId)
        if (result.error) {
            console.error("remove failed:", result.error)
            set({ bookmarks })
        }
    },
})
