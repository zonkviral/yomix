"use client"

import { memo, RefObject, useEffect, useRef, useState } from "react"

import { PageFlip } from "page-flip"

import { initBook, BookCache } from "./initConfig"
import { BookStructure } from "./buildStructure"

import { useReader } from "../ReaderContext"

import { FILTER_MAP } from "../constants"

interface Props {
    pages: string[]
    currentIndex: number
    onFlip: (index: number) => void
    cacheRef: RefObject<BookCache | null>
}

export const BookCanvas = memo(
    ({ pages, currentIndex, onFlip, cacheRef }: Props) => {
        const { filter } = useReader()
        const containerRef = useRef<HTMLDivElement>(null)
        const flipBookRef = useRef<PageFlip | null>(null)
        const pageToSlotRef = useRef<number[]>([])

        const [isLoading, setIsLoading] = useState(true)
        const [error, setError] = useState<string | null>(null)

        const onFlipRef = useRef(onFlip)
        useEffect(() => {
            onFlipRef.current = onFlip
        }, [onFlip])

        // reinit only when pages array changes (chapter switch)
        useEffect(() => {
            const container = containerRef.current
            if (!container) return

            const abortController = new AbortController()
            setIsLoading(true)
            setError(null)

            void initBook({
                container,
                pages,
                currentIndex,
                onFlipRef,
                flipBookRef,
                cacheRef,
                signal: abortController.signal,
                onLoaded: (structure: BookStructure) => {
                    pageToSlotRef.current = structure.pageToSlot
                    setIsLoading(false)
                },
                onError: (msg) => setError(msg),
            }).catch((err) => {
                console.error(err)
                setError("Failed to initialize reader")
            })

            return () => {
                abortController.abort()
                flipBookRef.current?.destroy()
                flipBookRef.current = null
            }
        }, [pages])

        useEffect(() => {
            const book = flipBookRef.current
            if (!book || book.getPageCount() === 0) return
            const slot = pageToSlotRef.current[currentIndex] ?? currentIndex
            if (book.getCurrentPageIndex() !== slot) {
                book.turnToPage(slot)
            }
        }, [currentIndex])

        return (
            <div className="relative flex h-full w-full items-center justify-center">
                <div
                    ref={containerRef}
                    className="h-full w-full"
                    style={{ filter: FILTER_MAP[filter] }}
                />

                {isLoading && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center">
                        <div className="flex h-3/4 w-1/2 max-w-sm animate-pulse flex-col gap-3 rounded bg-neutral-800 p-6">
                            <div className="h-6 w-3/4 rounded bg-neutral-700" />
                            <div className="h-4 w-full rounded bg-neutral-700" />
                            <div className="h-4 w-5/6 rounded bg-neutral-700" />
                            <div className="mt-auto h-4 w-1/2 rounded bg-neutral-700" />
                        </div>
                    </div>
                )}
                {error && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-black">
                        <p className="text-sm text-red-400">{error}</p>
                    </div>
                )}
            </div>
        )
    },
    (prev, next) =>
        prev.pages === next.pages &&
        prev.currentIndex === next.currentIndex &&
        prev.onFlip === next.onFlip &&
        prev.cacheRef === next.cacheRef,
)

BookCanvas.displayName = "BookCanvas"
