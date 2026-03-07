"use client"

import {
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Maximize2,
    Menu,
    Settings,
} from "lucide-react"

import { ModeButton } from "@/components/ModeButton/ModeButton"
import { HoverZone } from "@/components/HoverZone/HoverZone"

import { useReader } from "../ReaderContext"
import { Scrubber } from "../Scrubber"

import { useHudVisibility } from "@/hooks/useHudVisibility"

export const ReaderControls = () => {
    const { visible, show, hide } = useHudVisibility()
    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen()
        } else {
            document.exitFullscreen()
        }
    }
    const {
        index,
        totalPages,
        pagesThumbs,
        next,
        prev,
        readingMode,
        setReadingMode,
    } = useReader()

    const hudClass = `transition-opacity duration-200 ${
        visible ? "opacity-100" : "opacity-0 pointer-events-none"
    }`

    return (
        <>
            {/* Top zone */}
            <HoverZone
                className="absolute top-0 z-10 h-15 w-full"
                onShow={show}
                onHide={hide}
            >
                <div
                    className={`${hudClass} bg-surface absolute top-0 grid w-full grid-cols-3 items-center px-4 py-2 shadow-[0px_1px_4px_black]`}
                >
                    <div className="bg-primary flex w-fit rounded p-1.5">
                        <button type="button">
                            <Menu />
                        </button>
                    </div>
                    <div className="flex justify-center">
                        <span className="truncate text-sm text-white/60">
                            Title - Chapter
                        </span>
                    </div>
                    <div className="flex items-center justify-end gap-3">
                        <span className="font-mono text-[10px] text-white/60">
                            Page {index + 1} of {totalPages}
                        </span>
                        <div className="flex items-center gap-1">
                            <button type="button">
                                <Settings width={22} />
                            </button>
                            <button
                                type="button"
                                onClick={toggleFullscreen}
                                className="cursor-pointer"
                            >
                                <Maximize2 width={22} />
                            </button>
                        </div>
                    </div>
                </div>
            </HoverZone>

            {/* Bottom zone */}
            <HoverZone
                className="absolute bottom-0 z-10 h-25 w-full"
                onShow={show}
                onHide={hide}
            >
                <div
                    className={`${hudClass} bg-surface absolute bottom-0 w-full shadow-[0px_-1px_4px_black] backdrop-blur-sm`}
                >
                    <Scrubber pagesThumbs={pagesThumbs} />
                    <div className="flex items-center justify-center border-t border-white/5 px-4 py-2">
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={prev}
                                disabled={index === 0}
                                className="bg-primary flex cursor-pointer rounded py-1.5 pr-2 font-medium text-white/60 transition hover:bg-white/10 hover:text-white disabled:opacity-20"
                            >
                                <ChevronLeft />
                                <span>Prev</span>
                            </button>
                            <button
                                type="button"
                                className="bg-primary flex cursor-pointer rounded p-1.5"
                            >
                                <span>Chapters</span>
                                <ChevronDown className="ml-1" />
                            </button>
                            <button
                                type="button"
                                onClick={next}
                                disabled={index >= totalPages - 1}
                                className="bg-primary flex cursor-pointer rounded py-1.5 pl-2 font-medium text-white/60 transition hover:bg-white/10 hover:text-white disabled:opacity-20"
                            >
                                <span>Next</span>
                                <ChevronRight />
                            </button>
                        </div>
                        <div className="items-center gap-1 rounded-md bg-white/5 p-1">
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
                    </div>
                </div>
            </HoverZone>
        </>
    )
}
