import { removeBookmark } from "../../actions/remove-bookmark.action"
import { removeLocalBookmark } from "../../services/local-storage"

import { filterByExternalId } from "../helpers"

import { StoreSet, StoreGet } from "../types"

export const createRemoveSlice = (set: StoreSet, get: StoreGet) => ({
    remove: async (externalId: string) => {
        const { isGuest, bookmarks, continueReading, collections, activeBookmark } = get()

        set((s) => ({
            bookmarks: filterByExternalId(s.bookmarks, externalId),
            continueReading: filterByExternalId(s.continueReading, externalId),
            collections: s.collections.map((c) => ({
                ...c,
                manga_ids: c.manga_ids?.filter((id) => id !== externalId),
            })),
            activeBookmark:
                s.activeBookmark?.manga.external_id === externalId ? null : s.activeBookmark,
        }))

        if (isGuest) {
            removeLocalBookmark(externalId)
            return
        }

        const result = await removeBookmark(externalId)
        if (result.error) {
            console.error("remove failed:", result.error)
            set({ bookmarks, continueReading, collections, activeBookmark })
        }
        get().mutateBookmarks?.()
    },
})
