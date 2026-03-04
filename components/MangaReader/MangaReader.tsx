"use client"

import { useMemo, useState, useEffect, useRef } from "react"
import { ReaderContext, ReadingMode, ColorFilter } from "./ReaderContext"
import { useReaderNavigation } from "@/hooks/useReaderNavigation"
import { useZoom } from "@/hooks/useZoom"

import { ModeButton } from "@/components/ModeButton/ModeButton"
import { BookCanvas } from "./BookCanvas/BookCanvas"
import { WebtoonReader } from "./WebtoonReader"
import { SingleReader } from "./SingleReader"
import { Scrubber } from "./Scrubber"

import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react"

const FILTER_STYLE: Record<ColorFilter, React.CSSProperties> = {
    normal: {},
    dark: { filter: "brightness(0.75) contrast(1.1)" },
    sepia: { filter: "sepia(0.6) contrast(1.1) brightness(0.95)" },
}

export function MangaReader({
    pages,
    pagesThumbs,
}: {
    pages: string[]
    pagesThumbs: string[]
}) {
    const totalPages = pages.length
    const [readingMode, setReadingMode] = useState<ReadingMode>("single")
    const [colorFilter, setColorFilter] = useState<ColorFilter>("normal")
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
            totalPages,
            readingMode,
            setReadingMode,
            colorFilter,
            setColorFilter,
        }),
        [nav, totalPages, readingMode, colorFilter],
    )

    return (
        <ReaderContext.Provider value={contextValue}>
            <div
                ref={zoom.containerRef}
                className="fixed inset-0 flex flex-col bg-neutral-950"
            >
                {/* Reading area */}
                <div
                    onClick={zoom.toggle}
                    style={{ ...zoom.style, ...FILTER_STYLE[colorFilter] }}
                    className="flex-1 overflow-hidden will-change-transform"
                >
                    {readingMode === "single" && <SingleReader pages={pages} />}

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
                {/* Bottom HUD */}
                {true && (
                    <div className="absolute bottom-0 w-full shrink-0 bg-black/60 backdrop-blur-sm">
                        <Scrubber pagesThumbs={pagesThumbs} />

                        <div className="flex items-center justify-center border-t border-white/5 px-4 py-2">
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={nav.prev}
                                    disabled={nav.index === 0}
                                    className="flex rounded py-1.5 pr-2 font-medium text-white/60 transition hover:bg-white/10 hover:text-white disabled:opacity-20"
                                >
                                    <ChevronLeft />
                                    Prev
                                </button>
                                <button className="flex">
                                    Chapters <ChevronDown />
                                </button>
                                <button
                                    onClick={nav.next}
                                    disabled={nav.index >= totalPages - 1}
                                    className="bg-primary flex rounded py-1.5 pl-2 font-medium text-white/60 shadow-2xl shadow-gray-950 transition hover:bg-white/10 hover:text-white disabled:opacity-20"
                                >
                                    Next <ChevronRight />
                                </button>
                            </div>
                            {/* Reading mode */}
                            <div className="flex items-center gap-1 rounded-md bg-white/5 p-1">
                                <ModeButton
                                    label="Single"
                                    active={readingMode === "single"}
                                    onClick={() => setReadingMode("single")}
                                />
                                <ModeButton
                                    label="Book"
                                    active={readingMode === "book"}
                                    onClick={() => setReadingMode("book")}
                                />
                                <ModeButton
                                    label="Webtoon"
                                    active={readingMode === "webtoon"}
                                    onClick={() => setReadingMode("webtoon")}
                                />
                            </div>
                            {/* Color filter */}
                            {/* <div className="flex items-center gap-1 rounded-md bg-white/5 p-1">
                                <ModeButton
                                    label="Normal"
                                    active={colorFilter === "normal"}
                                    onClick={() => setColorFilter("normal")}
                                />
                                <ModeButton
                                    label="Sepia"
                                    active={colorFilter === "sepia"}
                                    onClick={() => setColorFilter("sepia")}
                                />
                                <ModeButton
                                    label="Dark"
                                    active={colorFilter === "dark"}
                                    onClick={() => setColorFilter("dark")}
                                />
                            </div> */}
                        </div>
                    </div>
                )}
            </div>
        </ReaderContext.Provider>
    )
}
