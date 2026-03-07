"use client"

import { memo, RefObject, useEffect, useRef, useState } from "react"
import { PageFlip } from "page-flip"
import { initBook } from "./initConfig"

interface Props {
    pages: string[]
    currentIndex: number
    onFlip: (index: number) => void
    urlCacheRef: RefObject<string[] | null>
}

export const BookCanvas = memo(
    ({ pages, currentIndex, onFlip, urlCacheRef }: Props) => {
        const containerRef = useRef<HTMLDivElement>(null)
        const flipBookRef = useRef<PageFlip | null>(null)

        const [isLoading, setIsLoading] = useState(true)
        const [error, setError] = useState<string | null>(null)

        const onFlipRef = useRef(onFlip)
        useEffect(() => {
            onFlipRef.current = onFlip
        }, [onFlip])

        useEffect(() => {
            if (!containerRef.current) return
            let mounted = true

            setIsLoading(true)
            setError(null)

            initBook({
                container: containerRef.current,
                pages,
                currentIndex,
                onFlipRef,
                flipBookRef,
                urlCacheRef,
                isMounted: () => mounted,
                onLoaded: () => setIsLoading(false),
                onError: (msg) => setError(msg),
            })

            return () => {
                mounted = false
                flipBookRef.current?.destroy()
                flipBookRef.current = null
            }
        }, [pages])

        useEffect(() => {
            const book = flipBookRef.current
            if (!book || book.getPageCount() === 0) return
            if (book.getCurrentPageIndex() !== currentIndex) {
                book.turnToPage(currentIndex)
            }
        }, [currentIndex])

        return (
            <>
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
                <div ref={containerRef} className="h-full w-full max-w-5xl" />
            </>
        )
    },
)

BookCanvas.displayName = "BookCanvas"
