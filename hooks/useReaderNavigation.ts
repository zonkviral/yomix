import { useState, useCallback } from "react"
import { ReadingMode } from "@/components/MangaReader/ReaderContext"

export function useReaderNavigation(totalPages: number, mode: ReadingMode) {
    const [index, setIndex] = useState(0)

    // Book mode uses step 2 (spreads), single and webtoon always 1
    const step = mode === "book" ? 2 : 1

    const next = useCallback(() => {
        setIndex((p) => Math.min(p + step, totalPages - 1))
    }, [step, totalPages])

    const prev = useCallback(() => {
        setIndex((p) => Math.max(p - step, 0))
    }, [step])

    return { index, setIndex, next, prev }
}
