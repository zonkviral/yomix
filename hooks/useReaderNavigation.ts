import { useState, useCallback } from "react"
import { ReadingMode } from "@/components/MangaReader/ReaderContext"

export function useReaderNavigation(totalPages: number, mode: ReadingMode) {
    const [index, setIndexRaw] = useState(0)

    const setIndex = useCallback(
        (i: number) => {
            const snapped = mode === "book" ? Math.floor(i / 2) * 2 : i
            setIndexRaw(Math.max(0, Math.min(snapped, totalPages - 1)))
        },
        [mode, totalPages],
    )

    const step = mode === "book" ? 2 : 1

    const next = useCallback(() => {
        setIndexRaw((p) => {
            const n = Math.min(p + step, totalPages - 1)
            return mode === "book" ? Math.floor(n / 2) * 2 : n
        })
    }, [step, totalPages, mode])

    const prev = useCallback(() => {
        setIndexRaw((p) => {
            const n = Math.max(p - step, 0)
            return mode === "book" ? Math.floor(n / 2) * 2 : n
        })
    }, [step, mode])

    return { index, setIndex, next, prev }
}
