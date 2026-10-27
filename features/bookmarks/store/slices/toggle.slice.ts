import { addBookmark } from "../../actions/add-bookmark.action"
import { removeBookmark } from "../../actions/remove-bookmark.action"

import { addLocalBookmark, removeLocalBookmark } from "../../services/local-storage"

import { filterByExternalId, addToToggling, removeFromToggling } from "../helpers"

import { Manga, Bookmark } from "@/lib/supabase/type"
import { StoreSet, StoreGet } from "../types"

export const createToggleSlice = (set: StoreSet, get: StoreGet) => ({
    toggle: async (externalId: string, manga: Manga) => {
        const { toggling, isGuest } = get()
        if (toggling.has(externalId)) return

        set((s) => ({ toggling: addToToggling(s.toggling, externalId) }))

        const previous = { bookmarks: get().bookmarks, activeBookmark: get().activeBookmark }
        const wasBookmarked = get().isBookmarked(externalId) // also looks at activeBookmark

        try {
            if (wasBookmarked) await handleRemove(externalId, isGuest, set)
            else await handleAdd(externalId, manga, isGuest, set)
            get().mutateBookmarks?.()
        } catch (err) {
            console.error("toggle failed:", err)
            set(previous)
        } finally {
            set((s) => ({ toggling: removeFromToggling(s.toggling, externalId) }))
        }
    },
})

const handleRemove = async (externalId: string, isGuest: boolean, set: StoreSet) => {
    set((s) => ({
        bookmarks: filterByExternalId(s.bookmarks, externalId),
        activeBookmark:
            s.activeBookmark?.manga.external_id === externalId ? null : s.activeBookmark,
    }))

    if (isGuest) {
        removeLocalBookmark(externalId)
        return
    }

    const result = await removeBookmark(externalId)
    if ("error" in result) throw new Error(result.error)
}

const handleAdd = async (externalId: string, manga: Manga, isGuest: boolean, set: StoreSet) => {
    const now = new Date().toISOString()
    const optimistic: Bookmark = {
        id: externalId,
        read_status: "plan_to_read",
        score: undefined,
        created_at: now,
        updated_at: now,
        manga: { ...manga, reading_progress: [] },
    }

    set((s) => ({ bookmarks: [optimistic, ...s.bookmarks], activeBookmark: optimistic }))

    if (isGuest) {
        addLocalBookmark(manga)
        return
    }

    const result = await addBookmark(externalId)
    if ("error" in result) {
        if (result.error === "Already bookmarked") return
        throw new Error(result.error)
    }

    // Replace the placeholder ids with the real ones from the database.
    const saved = result.data as unknown as { id: string; manga: { id: string } } | null
    if (!saved) return

    const withRealIds = (b: Bookmark): Bookmark =>
        b.manga.external_id === externalId
            ? { ...b, id: saved.id, manga: { ...b.manga, id: saved.manga.id } }
            : b

    set((s) => ({
        bookmarks: s.bookmarks.map(withRealIds),
        activeBookmark: s.activeBookmark ? withRealIds(s.activeBookmark) : null,
    }))
}
