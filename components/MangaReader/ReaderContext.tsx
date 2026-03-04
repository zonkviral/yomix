"use client"
import { createContext, useContext } from "react"

export type ReadingMode = "single" | "book" | "webtoon"
export type ColorFilter = "normal" | "dark" | "sepia"

interface ReaderContextValue {
    index: number
    totalPages: number
    setIndex: (i: number) => void
    next: () => void
    prev: () => void
    readingMode: ReadingMode
    setReadingMode: (m: ReadingMode) => void
    colorFilter: ColorFilter
    setColorFilter: (f: ColorFilter) => void
}

export const ReaderContext = createContext<ReaderContextValue | null>(null)

export const useReader = () => {
    const ctx = useContext(ReaderContext)
    if (!ctx) throw new Error("ReaderContext missing")
    return ctx
}
