// store/bookmarks.store.ts
import { create } from "zustand"

import { Bookmark, ReadStatus } from "@/lib/supabase/type"

import {
    updateLocalReadStatus,
    removeLocalBookmark,
} from "../services/local-storage"

import { updateReadStatus, removeBookmark } from "../actions"

interface BookmarksStore {
    bookmarks: Bookmark[]
    isGuest: boolean
    setGuest: (val: boolean) => void
    load: (bookmarks: Bookmark[]) => void
    updateStatus: (mangaId: string, status: ReadStatus) => Promise<void>
    remove: (mangaId: string) => Promise<void>
}

export const useBookmarksStore = create<BookmarksStore>((set, get) => ({
    bookmarks: [],
    isGuest: false,

    setGuest: (val) => set({ isGuest: val }),

    load: (bookmarks) => set({ bookmarks }),

    updateStatus: async (mangaId, status) => {
        set((state) => ({
            bookmarks: state.bookmarks.map((b) =>
                b.id === mangaId ? { ...b, read_status: status } : b,
            ),
        }))

        if (get().isGuest) {
            updateLocalReadStatus(mangaId, status)
        } else {
            await updateReadStatus(mangaId, status)
        }
    },

    remove: async (mangaId) => {
        set((state) => ({
            bookmarks: state.bookmarks.filter((b) => b.manga[0].id !== mangaId),
        }))

        if (get().isGuest) {
            removeLocalBookmark(mangaId)
        } else {
            await removeBookmark(mangaId)
        }
    },
}))
