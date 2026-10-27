import { updateReadStatus } from "../../actions/update-status.action"
import { updateLocalReadStatus } from "../../services/local-storage"

import { Bookmark, ReadStatus } from "@/lib/supabase/type"
import { StoreSet, StoreGet } from "../types"

const patchStatus = (bookmark: Bookmark, externalId: string, status: ReadStatus): Bookmark =>
    bookmark.manga.external_id === externalId
        ? { ...bookmark, read_status: status, updated_at: new Date().toISOString() }
        : bookmark

export const createStatusSlice = (set: StoreSet, get: StoreGet) => ({
    updateStatus: async (externalId: string, status: ReadStatus) => {
        const { bookmarks, continueReading, activeBookmark } = get()
        const oldStatus = [
            ...continueReading,
            ...bookmarks,
            ...(activeBookmark ? [activeBookmark] : []),
        ].find((b) => b.manga.external_id === externalId)?.read_status

        if (oldStatus === status) return

        set((s) => ({
            continueReading: s.continueReading.map((b) => patchStatus(b, externalId, status)),
            bookmarks: s.bookmarks.map((b) => patchStatus(b, externalId, status)),
            activeBookmark: s.activeBookmark
                ? patchStatus(s.activeBookmark, externalId, status)
                : null,
            statusCounts:
                oldStatus && oldStatus !== status
                    ? {
                          ...s.statusCounts,
                          [oldStatus]: Math.max(0, (s.statusCounts[oldStatus] ?? 0) - 1),
                          [status]: (s.statusCounts[status] ?? 0) + 1,
                      }
                    : s.statusCounts,
        }))

        if (get().isGuest) {
            updateLocalReadStatus(externalId, status)
            return
        }

        const result = await updateReadStatus(externalId, status)
        if (result.error) {
            console.error("updateStatus failed:", result.error)
            set({
                bookmarks,
                continueReading,
                activeBookmark,
            })
        }
        get().mutateBookmarks?.()
    },
})
