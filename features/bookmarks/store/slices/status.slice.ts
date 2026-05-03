import { updateReadStatus } from "../../actions/update-status.action"
import { updateLocalReadStatus } from "../../services/local-storage"

import { ReadStatus } from "@/lib/supabase/type"
import { StoreSet, StoreGet } from "../types"

export const createStatusSlice = (set: StoreSet, get: StoreGet) => ({
    updateStatus: async (mangaId: string, status: ReadStatus) => {
        const previous = get().bookmarks

        set((s) => ({
            bookmarks: s.bookmarks.map((b) =>
                b.manga.id === mangaId
                    ? {
                          ...b,
                          read_status: status,
                          updated_at: new Date().toISOString(),
                      }
                    : b,
            ),
        }))

        if (get().isGuest) {
            updateLocalReadStatus(mangaId, status)
            return
        }

        const result = await updateReadStatus(mangaId, status)
        if (result.error) {
            console.error("updateStatus failed:", result.error)
            set({ bookmarks: previous })
        }
    },
})
