import { create } from "zustand"

import { BookmarksStore } from "./types"
import { findByExternalId } from "./helpers"
import { createInitSlice } from "./slices/init.slice"
import { createToggleSlice } from "./slices/toggle.slice"
import { createStatusSlice } from "./slices/status.slice"
import { createRemoveSlice } from "./slices/remove.slice"

export const useBookmarksStore = create<BookmarksStore>((set, get) => ({
    bookmarks: [],
    isGuest: false,
    hydrated: false,
    toggling: new Set(),

    isBookmarked: (externalId) =>
        !!findByExternalId(get().bookmarks, externalId),

    getByExternalId: (externalId) =>
        findByExternalId(get().bookmarks, externalId),

    ...createInitSlice(set),
    ...createToggleSlice(set, get),
    ...createStatusSlice(set, get),
    ...createRemoveSlice(set, get),
}))
