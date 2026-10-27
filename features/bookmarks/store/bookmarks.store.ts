import { create } from "zustand"

import { createInitSlice } from "./slices/init.slice"
import { createToggleSlice } from "./slices/toggle.slice"
import { createStatusSlice } from "./slices/status.slice"
import { createRemoveSlice } from "./slices/remove.slice"
import { createProgressSlice } from "./slices/progress.slice"
import { collectionSlice } from "./slices/collection.slice"

import { BookmarksStore } from "./types"
import { findByExternalId } from "./helpers"

export const useBookmarksStore = create<BookmarksStore>((set, get) => ({
    bookmarks: [],
    activeBookmark: null,
    collections: [],
    continueReading: [],
    recentlyAdded: [],
    statusCounts: {},
    mutateBookmarks: null,
    hydrateActiveBookmark: (bookmark) => set({ activeBookmark: bookmark }),
    setMutateBookmarks: (fn) => set({ mutateBookmarks: fn }),
    stats: null,
    isGuest: false,
    toggling: new Set(),

    isBookmarked: (externalId) => {
        const { bookmarks, activeBookmark } = get()
        return (
            !!findByExternalId(bookmarks, externalId) ||
            activeBookmark?.manga.external_id === externalId
        )
    },
    getByExternalId: (externalId) => {
        const { bookmarks, activeBookmark } = get()
        return (
            findByExternalId(bookmarks, externalId) ??
            (activeBookmark?.manga.external_id === externalId ? activeBookmark : undefined)
        )
    },

    ...createInitSlice(set),
    ...createToggleSlice(set, get),
    ...createStatusSlice(set, get),
    ...createRemoveSlice(set, get),
    ...createProgressSlice(set, get),
    ...collectionSlice(set, get),
}))
