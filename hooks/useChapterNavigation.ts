import { useReader } from "@/components/MangaReader/ReaderContext"

export const useChapterNavigation = () => {
    const { chapterList, currentChapterId, switchChapter, chapterLoading } =
        useReader()

    const currentIndex = chapterList.findIndex((c) => c.id === currentChapterId)
    const prevChapter = chapterList[currentIndex - 1] ?? null
    const nextChapter = chapterList[currentIndex + 1] ?? null

    const goNext = nextChapter ? () => switchChapter(nextChapter.id) : null
    const goPrev = prevChapter ? () => switchChapter(prevChapter.id) : null

    return {
        goNext,
        goPrev,
        nextChapter,
        prevChapter,
        currentIndex,
        chapterLoading,
    }
}
