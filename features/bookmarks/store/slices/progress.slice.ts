import { saveProgress } from "../../actions/save-progress.action"

import { updateLocalReadingProgress } from "../../services/local-storage"

import { BookmarksStore, StoreSet } from "../types"

export const createProgressSlice = (
    set: StoreSet,
    get: () => BookmarksStore,
) => ({
    saveProgress: async (
        externalMangaId: string,
        chapterId: string,
        chapterNumber: number,
        pageNumber: number,
    ) => {
        const { isGuest, bookmarks } = get()

        const bookmark = bookmarks.find((b) =>
            b.manga.manga_sources?.some(
                (ms) => ms.external_id === externalMangaId,
            ),
        )

        set((s) => ({
            continueReading: s.continueReading.map((b) =>
                b.manga.manga_sources?.some(
                    (ms) => ms.external_id === externalMangaId,
                )
                    ? {
                          ...b,
                          manga: {
                              ...b.manga,
                              reading_progress: [
                                  {
                                      chapter_id: chapterId,
                                      chapter_number: chapterNumber,
                                      page_number: pageNumber,
                                  },
                              ],
                          },
                      }
                    : b,
            ),
            bookmarks: s.bookmarks.map((b) =>
                b.manga.manga_sources?.some(
                    (ms) => ms.external_id === externalMangaId,
                )
                    ? {
                          ...b,
                          manga: {
                              ...b.manga,
                              reading_progress: [
                                  {
                                      chapter_id: chapterId,
                                      chapter_number: chapterNumber,
                                      page_number: pageNumber,
                                  },
                              ],
                          },
                      }
                    : b,
            ),
        }))

        if (isGuest) {
            updateLocalReadingProgress(
                externalMangaId,
                chapterId,
                chapterNumber,
                pageNumber,
            )
            return
        }

        if (!bookmark?.manga.id) return

        const payload = {
            externalId: externalMangaId,
            chapterId,
            chapterNumber,
            pageNumber,
        }

        const result = await saveProgress(payload)

        if (result.error) {
            console.error("Failed to save progress:", result.error)
        }
    },
})
