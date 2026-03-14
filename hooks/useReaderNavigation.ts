import { useState, useCallback } from "react"
import { ReadingMode } from "@/components/MangaReader/ReaderContext"

export function useReaderNavigation(totalPages: number, mode: ReadingMode) {
    const [index, setIndexRaw] = useState(0)

    const setIndex = useCallback(
        (i: number) => {
            setIndexRaw(Math.max(0, Math.min(i, totalPages - 1)))
        },
        [totalPages],
    )

    const step = mode === "book" ? 2 : 1

    const next = useCallback(() => {
        setIndexRaw((p) => Math.min(p + step, totalPages - 1))
    }, [step, totalPages])

    const prev = useCallback(() => {
        setIndexRaw((p) => Math.max(p - step, 0))
    }, [step])

    return { index, setIndex, next, prev }
}
