"use client"

import { Chapter } from "@/lib/MangaDex/types"
import { createContext, useContext } from "react"

export type ReadingMode = "single" | "book" | "webtoon"
export type ReaderFilter = "default" | "warm" | "invert" | "brightness"
export type ReaderBgColor = "default" | "black" | "sepia" | "gray"

interface ReaderContextValue {
    // page navigation
    index: number
    totalPages: number
    pagesThumbs: string[]
    setIndex: (i: number) => void
    next: () => void
    prev: () => void
    // chapter
    mangaTitle: string
    mangaId: string
    currentChapterId: string
    chapterList: Chapter[]
    switchChapter: (id: string) => Promise<void>
    chapterLoading: boolean
    // settings
    readingMode: ReadingMode
    setReadingMode: (m: ReadingMode) => void
    filter: ReaderFilter
    setFilter: (f: ReaderFilter) => void
    bgColor: ReaderBgColor
    setBgColor: (b: ReaderBgColor) => void
}

export const ReaderContext = createContext<ReaderContextValue | null>(null)

export const useReader = () => {
    const ctx = useContext(ReaderContext)
    if (!ctx) throw new Error("ReaderContext missing")
    return ctx
}
