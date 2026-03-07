"use client"

import { useMemo, useState, useEffect, useRef } from "react"
import { ReaderContext, ReadingMode } from "./ReaderContext"
import { useReaderNavigation } from "@/hooks/useReaderNavigation"
import { useZoom } from "@/hooks/useZoom"

import { BookCanvas } from "./BookCanvas/BookCanvas"
import { WebtoonReader } from "./WebtoonReader"
import { SingleReader } from "./SingleReader"

import { ReaderControls } from "./ReaderControls/ReaderControls"
import { Noise } from "../Noise/Noise"

export function MangaReader({
    pages,
    pagesThumbs,
}: {
    pages: string[]
    pagesThumbs: string[]
}) {
    const totalPages = pages.length
    const [readingMode, setReadingMode] = useState<ReadingMode>("single")
    const urlCacheRef = useRef<string[] | null>(null)

    const nav = useReaderNavigation(totalPages, readingMode)
    const zoom = useZoom()

    // Keyboard navigation
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
            readingMode,
            setReadingMode,
        }),
        [nav, totalPages, readingMode],
    )
    return (
        <ReaderContext.Provider value={contextValue}>
            <div
                ref={zoom.containerRef}
                className="fixed inset-0 flex flex-col"
            >
                <ReaderControls />
                {/* Reading area */}
                <div
                    onClick={zoom.toggle}
                    style={{ ...zoom.style }}
                    className="flex-1 overflow-hidden will-change-transform"
                >
                    <div className="relative flex h-full w-full items-center justify-center bg-[#0d0f14]">
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
