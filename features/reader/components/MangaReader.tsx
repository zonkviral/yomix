"use client"

import { useMemo, useState, useEffect, useRef, useCallback } from "react"

import {
    ReaderBgColor,
    ReaderConfigContext,
    ReaderFilter,
    ReaderPlaybackContext,
    ReadingMode,
} from "./ReaderContext"

import { getChapterPages } from "@/actions/getChapterPages.action"

import { Noise } from "@/components/ui/Noise/Noise"

import { BookCanvas } from "./BookCanvas/BookCanvas"
import { BookCache } from "./BookCanvas/initConfig"
import { WebtoonReader } from "./WebtoonReader"
import { SingleReader } from "./SingleReader"
import { ReaderControls } from "./ReaderControls/ReaderControls"

import { useReaderNavigation } from "../hooks/useReaderNavigation"
import { useZoom } from "@/features/reader/hooks/useZoom"

import { Chapter } from "@/lib/MangaDex/types"

import { BG_COLOR_MAP } from "../constants"

interface MangaReaderProps {
    mangaId: string
    initialChapterId: string
    initialPage?: number
    initialPages: string[]
    initialPagesThumbs: string[]
    chapterList: Chapter[]
    mangaTitle: string
}

export const MangaReader = ({
    mangaId,
    initialChapterId,
    initialPage = 0,
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
    const requestIdRef = useRef(0)
    const currentChapterIndex = useMemo(
        () => chapterList.findIndex((c) => c.id === currentChapterId),
        [chapterList, currentChapterId],
    )

    const nav = useReaderNavigation(pages.length, readingMode, {
        onAtEnd: () => {
            const nextChapter = chapterList[currentChapterIndex + 1] ?? null
            if (nextChapter && !chapterLoading) {
                queueMicrotask(() => switchChapter(nextChapter.id))
            }
        },
        onAtStart: () => {
            const prevChapter = chapterList[currentChapterIndex - 1] ?? null
            if (prevChapter && !chapterLoading) {
                queueMicrotask(() => switchChapter(prevChapter.id, -1))
            }
        },
    })
    const navRef = useRef(nav)
    const zoom = useZoom()

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "ArrowRight") navRef.current.next()
            if (e.key === "ArrowLeft") navRef.current.prev()
        }
        window.addEventListener("keydown", onKey)
        return () => window.removeEventListener("keydown", onKey)
    }, [])

    useEffect(() => {
        navRef.current = nav
    }, [nav])

    useEffect(() => {
        if (initialPage > 0) nav.setIndex(initialPage)
    }, [])

    const switchChapter = useCallback(
        async (chapterId: string, initialPage?: number) => {
            const requestId = ++requestIdRef.current
            setChapterLoading(true)
            try {
                const data = await getChapterPages(chapterId)
                if (requestId !== requestIdRef.current) return

                setPages(data.pages)
                setPagesThumbs(data.pagesThumbs)
                setCurrentChapterId(chapterId)
                cacheRef.current = null
                const pageToSet =
                    initialPage === -1
                        ? Math.max(0, data.pages.length - 1)
                        : (initialPage ?? 0)
                nav.setRawIndex(pageToSet)
                window.history.pushState(
                    {},
                    "",
                    `/manga/${mangaId}/chapter/${chapterId}`,
                )
            } finally {
                if (requestId === requestIdRef.current) {
                    setChapterLoading(false)
                }
            }
        },
        [mangaId, nav.setRawIndex],
    )

    const { pageIndex, setIndex, next, prev } = nav

    const configValue = useMemo(
        () => ({
            mangaId,
            currentChapterId,
            chapterList,
            switchChapter,
            mangaTitle,
            readingMode,
            setReadingMode,
            filter,
            setFilter,
            bgColor,
            setBgColor,
        }),
        [
            mangaId,
            currentChapterId,
            chapterList,
            switchChapter,
            mangaTitle,
            readingMode,
            setReadingMode,
            filter,
            setFilter,
            bgColor,
            setBgColor,
        ],
    )

    const playbackValue = useMemo(
        () => ({
            pageIndex,
            setIndex,
            next,
            prev,
            totalPages: pages.length,
            pagesThumbs,
            chapterLoading,
        }),
        [
            pageIndex,
            setIndex,
            next,
            prev,
            pages.length,
            pagesThumbs,
            chapterLoading,
        ],
    )

    return (
        <ReaderConfigContext.Provider value={configValue}>
            <ReaderPlaybackContext.Provider value={playbackValue}>
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
                                    currentIndex={nav.pageIndex}
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
            </ReaderPlaybackContext.Provider>
        </ReaderConfigContext.Provider>
    )
}
