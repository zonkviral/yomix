import { removeBookmark } from "../../actions/remove-bookmark.action"
import { removeLocalBookmark } from "../../services/local-storage"

import { findByExternalId, filterByExternalId } from "../helpers"

import { StoreSet, StoreGet } from "../types"

export const createRemoveSlice = (set: StoreSet, get: StoreGet) => ({
    remove: async (externalId: string) => {
        const { isGuest, bookmarks, continueReading } = get()
        const internalId = findByExternalId(bookmarks, externalId)?.manga.id

        set((s) => ({
            bookmarks: filterByExternalId(s.bookmarks, externalId),
            continueReading: filterByExternalId(s.continueReading, externalId),
            collections: s.collections.map((c) => ({
                ...c,
                manga_ids: c.manga_ids?.filter((id) => id !== internalId),
            })),
        }))

        if (isGuest) {
            removeLocalBookmark(externalId)
            return
        }

        if (!internalId) {
            set({ bookmarks, continueReading })
            return
        }

        const result = await removeBookmark(internalId)
        if (result.error) {
            console.error("remove failed:", result.error)
            set({ bookmarks, continueReading })
        }
        get().mutateBookmarks?.()
    },
})
