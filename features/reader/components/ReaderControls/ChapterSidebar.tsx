"use client"

import { useCallback, useEffect, useRef } from "react"

import { List } from "@/components/ui/List/List"
import { useReaderConfig, useReaderPlayback } from "../ReaderContext"
import { useReaderUI } from "./ReaderUIContext"
import { Bookmark, Eye, EyeOff } from "lucide-react"

import { useBookmarksStore } from "@/features/bookmarks/store/bookmarks.store"
import { findByExternalId } from "@/features/bookmarks/store/helpers"

export const ChapterSidebar = () => {
    const { saveProgress, bookmarks } = useBookmarksStore()

    const { chapterList, currentChapterId, switchChapter, mangaId } =
        useReaderConfig()
    const { chapterLoading, pageIndex } = useReaderPlayback()

    const { sidebarOpen } = useReaderUI()
    const activeRef = useRef<HTMLButtonElement>(null)
    const isRead = findByExternalId(bookmarks, mangaId)
    useEffect(() => {
        if (!sidebarOpen) return

        const timer = setTimeout(() => {
            activeRef.current?.scrollIntoView({
                block: "center",
                behavior: "smooth",
            })
        }, 350)

        return () => clearTimeout(timer)
    }, [sidebarOpen])

    const renderChapterItem = useCallback(
        (data: (typeof chapterList)[number]) => {
            const isActive = data.id === currentChapterId
            const chapterNumber = parseFloat(data.attributes.chapter!)
            const progressChapterNumber =
                isRead?.manga.reading_progress[0]?.chapter_number ?? 0

            return (
                <div
                    className={`flex px-1 py-1.5 hover:bg-neutral-800 hover:text-white ${isActive ? "bg-neutral-800 text-white" : ""}`}
                >
                    <button
                        onClick={() =>
                            saveProgress(
                                mangaId,
                                data.id!,
                                chapterNumber,
                                isActive ? pageIndex : 1,
                            )
                        }
                    >
                        {isRead?.manga.reading_progress[0]?.chapter_id ===
                        data.id ? (
                            <Bookmark className="mx-2 w-4 fill-rose-700 stroke-0" />
                        ) : isRead && progressChapterNumber > chapterNumber ? (
                            <Eye className="mx-2 w-4 text-neutral-700 hover:text-neutral-200" />
                        ) : (
                            <EyeOff className="mx-2 w-4 text-neutral-400 hover:text-neutral-200" />
                        )}
                    </button>
                    <button
                        ref={isActive ? activeRef : null}
                        type="button"
                        disabled={chapterLoading}
                        onClick={() => switchChapter(data.id)}
                        className="flex w-full p-1 text-left text-sm text-white/60 transition-colors duration-150 hover:underline disabled:opacity-50"
                    >
                        {`Том ${data.attributes.volume} - Глава ${data.attributes.chapter}`}
                    </button>
                </div>
            )
        },
        [
            currentChapterId,
            isRead,
            mangaId,
            pageIndex,
            saveProgress,
            switchChapter,
            chapterLoading,
        ],
    )

    return (
        <div
            className={`bg-primary absolute top-(--reader-top-h) bottom-(--reader-bottom-h) z-3 w-fit overflow-y-auto shadow-[4px_0px_2px_-2px_black] transition-transform duration-300 ease-in-out [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
                sidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
        >
            <List
                className="py-1"
                items={chapterList}
                renderItem={renderChapterItem}
            />
        </div>
    )
}
