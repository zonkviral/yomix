"use client"

import { useMemo, useState, useEffect, useRef, useCallback } from "react"

import {
    ReaderBgColor,
    ReaderContext,
    ReaderFilter,
    ReadingMode,
} from "./ReaderContext"

import { getChapterPages } from "@/actions/getChapterPages.action"

import { useReaderNavigation } from "@/hooks/useReaderNavigation"
import { useZoom } from "@/hooks/useZoom"

import { Noise } from "@/components/Noise/Noise"
import { BookCanvas } from "./BookCanvas/BookCanvas"
import { BookCache } from "./BookCanvas/initConfig"
import { WebtoonReader } from "./WebtoonReader"
import { SingleReader } from "./SingleReader"
import { ReaderControls } from "./ReaderControls/ReaderControls"

import { Chapter } from "@/lib/MangaDex/types"

import { BG_COLOR_MAP } from "./constants"

interface MangaReaderProps {
    mangaId: string
    initialChapterId: string
    initialPages: string[]
    initialPagesThumbs: string[]
    chapterList: Chapter[]
    mangaTitle: string
}

export const MangaReader = ({
    mangaId,
    initialChapterId,
    initialPages,
    initialPagesThumbs,
    chapterList,
    mangaTitle,
}: MangaReaderProps) => {
    const [pages, setPages] = useState(initialPages)
    const [pagesThumbs, setPagesThumbs] = useState(initialPagesThumbs)
    const [currentChapterId, setCurrentChapterId] = useState(initialChapterId)
    const [chapterLoading, setChapterLoading] = useState(false)

    const [readingMode, setReadingMode] = useState<ReadingMode>("single")
    const [filter, setFilter] = useState<ReaderFilter>("default")
    const [bgColor, setBgColor] = useState<ReaderBgColor>("default")

    const cacheRef = useRef<BookCache | null>(null)
    const nav = useReaderNavigation(pages.length, readingMode)
    const navRef = useRef(nav)
    const zoom = useZoom()

    useEffect(() => {
        navRef.current = nav
    }, [nav])

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "ArrowRight") navRef.current.next()
            if (e.key === "ArrowLeft") navRef.current.prev()
        }
        window.addEventListener("keydown", onKey)
        return () => window.removeEventListener("keydown", onKey)
    }, [])

    const switchChapter = useCallback(
        async (chapterId: string) => {
            setChapterLoading(true)
            try {
                const data = await getChapterPages(chapterId)
                setPages(data.pages)
                setPagesThumbs(data.pagesThumbs)
                setCurrentChapterId(chapterId)
                cacheRef.current = null // clear cache on chapter switch
                nav.setIndex(0)
                window.history.pushState(
                    {},
                    "",
                    `/manga/${mangaId}/chapter/${chapterId}`,
                )
            } finally {
                setChapterLoading(false)
            }
        },
        [mangaId, nav],
    )

    const contextValue = useMemo(
        () => ({
            ...nav,
            mangaId,
            currentChapterId,
            chapterList,
            pagesThumbs,
            totalPages: pages.length,
            switchChapter,
            chapterLoading,
            bgColor,
            setBgColor,
            filter,
            setFilter,
            readingMode,
            setReadingMode,
            mangaTitle,
        }),
        [
            nav,
            pages.length,
            currentChapterId,
            chapterLoading,
            readingMode,
            filter,
            bgColor,
            pagesThumbs,
            switchChapter,
        ],
    )

    return (
        <ReaderContext.Provider value={contextValue}>
            <div
                ref={zoom.containerRef}
                className="fixed inset-0 flex flex-col"
            >
                <ReaderControls />
                <div
                    onDoubleClick={zoom.onDoubleClick}
                    style={{ ...zoom.style }}
                    className="flex-1 overflow-hidden will-change-transform"
                >
                    <div
                        className="relative flex h-full w-full items-center justify-center"
                        style={{
                            backgroundColor: BG_COLOR_MAP[bgColor],
                            transition: "background-color 0.3s",
                        }}
                    >
                        <Noise opacity={0.04} />

                        {chapterLoading && (
                            <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50">
                                <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                            </div>
                        )}

                        {readingMode === "single" && (
                            <SingleReader pages={pages} />
                        )}
                        {readingMode === "book" && (
                            <BookCanvas
                                key={`book-${pages[0]}`}
                                pages={pages}
                                currentIndex={nav.index}
                                onFlip={nav.setIndex}
                                cacheRef={cacheRef}
                            />
                        )}
                        {readingMode === "webtoon" && (
                            <WebtoonReader pages={pages} />
                        )}
                    </div>
                </div>
            </div>
        </ReaderContext.Provider>
    )
}
