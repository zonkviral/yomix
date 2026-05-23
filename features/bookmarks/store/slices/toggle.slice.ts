import { addBookmark } from "../../actions/add-bookmark.action"
import { removeBookmark } from "../../actions/remove-bookmark.action"

import {
    addLocalBookmark,
    removeLocalBookmark,
} from "../../services/local-storage"

import {
    findByExternalId,
    filterByExternalId,
    addToToggling,
    removeFromToggling,
} from "../helpers"

import { Manga, Bookmark } from "@/lib/supabase/type"
import { StoreSet, StoreGet } from "../types"

export const createToggleSlice = (set: StoreSet, get: StoreGet) => ({
    toggle: async (externalId: string, manga: Manga) => {
        const { toggling, isGuest, bookmarks } = get()

        if (toggling.has(externalId)) return

        set((s) => ({ toggling: addToToggling(s.toggling, externalId) }))

        const wasBookmarked = !!findByExternalId(bookmarks, externalId)

        try {
            if (wasBookmarked) {
                await handleRemove({ externalId, isGuest, bookmarks, set })
            } else {
                await handleAdd({ externalId, manga, isGuest, bookmarks, set })
            }
        } catch (err) {
            console.error("toggle error:", err)
            set({ bookmarks })
        } finally {
            set((s) => ({
                toggling: removeFromToggling(s.toggling, externalId),
            }))
        }
    },
})

interface RemoveParams {
    externalId: string
    isGuest: boolean
    bookmarks: Bookmark[]
    set: StoreSet
}

const handleRemove = async ({
    externalId,
    isGuest,
    bookmarks,
    set,
}: RemoveParams) => {
    const internalId = findByExternalId(bookmarks, externalId)?.manga.id

    set((s) => ({ bookmarks: filterByExternalId(s.bookmarks, externalId) }))

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
        console.error("removeBookmark failed:", result.error)
        set({ bookmarks })
    }
}

interface AddParams {
    externalId: string
    manga: Manga
    isGuest: boolean
    bookmarks: Bookmark[]
    set: StoreSet
}

const handleAdd = async ({
    externalId,
    manga,
    isGuest,
    bookmarks,
    set,
}: AddParams) => {
    const newBookmark: Bookmark = {
        id: externalId,
        read_status: "plan_to_read",
        score: undefined,
        updated_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        manga: {
            ...manga,
            reading_progress: [],
        },
    }

    set((s) => ({ bookmarks: [newBookmark, ...s.bookmarks] }))

    if (isGuest) {
        addLocalBookmark({
            id: externalId,
            title: manga.title,
            cover_url: manga.cover_url,
            author: manga.author,
            total_chapters: manga.total_chapters,
            manga_sources: manga.manga_sources,
            reading_progress: [],
        })
        return
    }
    const result = await addBookmark(manga)
    if (result.error) {
        console.error("addBookmark failed:", result.error)
        set({ bookmarks })
    }
}
