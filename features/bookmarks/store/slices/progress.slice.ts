import { ChapterSource } from "@/lib/chapters/types"
import { saveProgress as saveProgressAction } from "../../actions/save-progress.action"
import { updateLocalReadingProgress } from "../../services/local-storage"
import { BookmarksStore, StoreSet } from "../types"
import type { Bookmark, ReadingProgress } from "@/lib/supabase/type"

const patchProgress = (
    bookmark: Bookmark,
    externalMangaId: string,
    progress: ReadingProgress,
): Bookmark =>
    bookmark.manga.external_id === externalMangaId
        ? { ...bookmark, manga: { ...bookmark.manga, reading_progress: [progress] } }
        : bookmark

export const createProgressSlice = (set: StoreSet, get: () => BookmarksStore) => {
    const saveTimers = new Map<string, ReturnType<typeof setTimeout>>()

    return {
        saveProgress: async (
            externalMangaId: string,
            chapterId: string,
            chapterNumber: number,
            pageNumber: number,
            source: ChapterSource,
        ) => {
            const { bookmarks, continueReading, isGuest } = get()
            const previousBookmarks = bookmarks
            const previousContinueReading = continueReading

            const progress: ReadingProgress = {
                chapter_id: chapterId,
                chapter_number: chapterNumber,
                page_number: pageNumber,
                source,
            }

            set((s) => ({
                bookmarks: s.bookmarks.map((b) => patchProgress(b, externalMangaId, progress)),
                continueReading: s.continueReading.map((b) =>
                    patchProgress(b, externalMangaId, progress),
                ),
            }))

            if (isGuest) {
                updateLocalReadingProgress(
                    externalMangaId,
                    chapterId,
                    chapterNumber,
                    pageNumber,
                    source,
                )
                return
            }

            clearTimeout(saveTimers.get(externalMangaId))
            saveTimers.set(
                externalMangaId,
                setTimeout(async () => {
                    saveTimers.delete(externalMangaId)
                    const result = await saveProgressAction({
                        externalId: externalMangaId,
                        chapterId,
                        chapterNumber,
                        pageNumber,
                        source,
                    })
                    if (result.error) {
                        console.error("Failed to save progress:", result.error)
                        set({
                            continueReading: previousContinueReading,
                            bookmarks: previousBookmarks,
                        })
                    }
                }, 800),
            )
        },
    }
}
