import { useState, useCallback, useEffect, useRef } from "react"
import { ReadingMode } from "../components/ReaderContext"

type EdgeHandlers = {
    onAtEnd?: () => void
    onAtStart?: () => void
}

export const useReaderNavigation = (
    totalPages: number,
    mode: ReadingMode,
    handlers?: EdgeHandlers,
) => {
    const [pageIndex, setPageIndex] = useState(0)
    const handlersRef = useRef<EdgeHandlers | undefined>(handlers)

    useEffect(() => {
        handlersRef.current = handlers
    }, [handlers])

    const setIndex = useCallback(
        (i: number) => {
            setPageIndex(Math.max(0, Math.min(i, totalPages - 1)))
        },
        [totalPages],
    )

    const setRawIndex = useCallback((i: number) => {
        setPageIndex(i)
    }, [])

    const step = mode === "book" ? 2 : 1

    const next = useCallback(() => {
        setPageIndex((p) => {
            const proposed = Math.min(p + step, totalPages - 1)
            if (p === totalPages - 1) {
                handlersRef.current?.onAtEnd?.()
                return p
            }
            if (p + step > totalPages - 1) {
                handlersRef.current?.onAtEnd?.()
                return totalPages - 1
            }
            return proposed
        })
    }, [step, totalPages])

    const prev = useCallback(() => {
        setPageIndex((p) => {
            const proposed = Math.max(p - step, 0)
            if (p === 0) {
                handlersRef.current?.onAtStart?.()
                return p
            }
            if (p - step < 0) {
                handlersRef.current?.onAtStart?.()
                return 0
            }
            return proposed
        })
    }, [step])

    return { pageIndex, setIndex, setRawIndex, next, prev }
}
