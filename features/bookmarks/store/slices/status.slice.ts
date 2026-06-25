import { updateReadStatus } from "../../actions/update-status.action"
import { updateLocalReadStatus } from "../../services/local-storage"

import { ReadStatus } from "@/lib/supabase/type"
import { StoreSet, StoreGet } from "../types"

export const createStatusSlice = (set: StoreSet, get: StoreGet) => ({
    updateStatus: async (mangaId: string, status: ReadStatus) => {
        const previous = get().bookmarks
        const continueReadingPrevious = get().continueReading
        const oldStatus = continueReadingPrevious
            .concat(previous)
            .find((b) => b.manga.id === mangaId)?.read_status

        if (oldStatus === status) return

        set((s) => ({
            continueReading: s.continueReading.map((b) =>
                b.manga.id === mangaId
                    ? {
                          ...b,
                          read_status: status,
                          updated_at: new Date().toISOString(),
                      }
                    : b,
            ),
            bookmarks: s.bookmarks.map((b) =>
                b.manga.id === mangaId
                    ? {
                          ...b,
                          read_status: status,
                          updated_at: new Date().toISOString(),
                      }
                    : b,
            ),
            statusCounts:
                oldStatus && oldStatus !== status
                    ? {
                          ...s.statusCounts,
                          [oldStatus]: Math.max(
                              0,
                              (s.statusCounts[oldStatus] ?? 0) - 1,
                          ),
                          [status]: (s.statusCounts[status] ?? 0) + 1,
                      }
                    : s.statusCounts,
        }))

        if (get().isGuest) {
            updateLocalReadStatus(mangaId, status)
            return
        }

        const result = await updateReadStatus(mangaId, status)
        if (result.error) {
            console.error("updateStatus failed:", result.error)
            set({
                bookmarks: previous,
                continueReading: continueReadingPrevious,
            })
        }
        get().mutateBookmarks?.()
    },
})
