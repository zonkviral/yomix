"use client"

import { useMemo, useState, useEffect, useRef } from "react"

import {
    ReaderBgColor,
    ReaderContext,
    ReaderFilter,
    ReadingMode,
} from "./ReaderContext"

import { useReaderNavigation } from "@/hooks/useReaderNavigation"
import { useZoom } from "@/hooks/useZoom"

import { BookCanvas } from "./BookCanvas/BookCanvas"
import { WebtoonReader } from "./WebtoonReader"
import { SingleReader } from "./SingleReader"
import { ReaderControls } from "./ReaderControls/ReaderControls"
import { Noise } from "@/components/Noise/Noise"

import { BG_COLOR_MAP } from "./constants"

export function MangaReader({
    pages,
    pagesThumbs,
}: {
    pages: string[]
    pagesThumbs: string[]
}) {
    const [readingMode, setReadingMode] = useState<ReadingMode>("single")
    const [filter, setFilter] = useState<ReaderFilter>("default")
    const [bgColor, setBgColor] = useState<ReaderBgColor>("default")
    const totalPages = pages.length

    const urlCacheRef = useRef<string[] | null>(null)

    const nav = useReaderNavigation(totalPages, readingMode)
    const zoom = useZoom()

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "ArrowRight") nav.next()
            if (e.key === "ArrowLeft") nav.prev()
        }
        window.addEventListener("keydown", onKey)
        return () => window.removeEventListener("keydown", onKey)
    }, [nav.next, nav.prev])

    const contextValue = useMemo(
        () => ({
            ...nav,
            pagesThumbs,
            totalPages,
            bgColor,
            setBgColor,
            filter,
            setFilter,
            readingMode,
            setReadingMode,
        }),
        [nav, totalPages, readingMode, filter],
    )
    return (
        <ReaderContext.Provider value={contextValue}>
            <div
                ref={zoom.containerRef}
                className="fixed inset-0 flex flex-col"
            >
                <ReaderControls />
                <div
                    onClick={zoom.toggle}
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
                        {readingMode === "single" && (
                            <SingleReader pages={pages} />
                        )}

                        {readingMode === "book" && (
                            <BookCanvas
                                key={`book-${pages[0]}`}
                                pages={pages}
                                currentIndex={nav.index}
                                onFlip={nav.setIndex}
                                urlCacheRef={urlCacheRef}
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
