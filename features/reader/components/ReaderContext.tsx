"use client"

import { Chapter } from "@/lib/MangaDex/types"
import { createContext, useContext } from "react"

export type ReadingMode = "single" | "book" | "webtoon"
export type ReaderFilter = "default" | "warm" | "invert" | "brightness"
export type ReaderBgColor = "default" | "black" | "sepia" | "gray"

export interface ReaderConfigContextValue {
    mangaTitle: string
    mangaId: string
    currentChapterId: string
    chapterList: Chapter[]
    switchChapter: (id: string) => Promise<void>
    readingMode: ReadingMode
    setReadingMode: (m: ReadingMode) => void
    filter: ReaderFilter
    setFilter: (f: ReaderFilter) => void
    bgColor: ReaderBgColor
    setBgColor: (b: ReaderBgColor) => void
}

export interface ReaderPlaybackContextValue {
    pageIndex: number
    totalPages: number
    pagesThumbs: string[]
    setIndex: (i: number) => void
    next: () => void
    prev: () => void
    chapterLoading: boolean
}

const ReaderConfigContext = createContext<ReaderConfigContextValue | null>(null)
const ReaderPlaybackContext = createContext<ReaderPlaybackContextValue | null>(
    null,
)

export const useReaderConfig = () => {
    const ctx = useContext(ReaderConfigContext)
    if (!ctx) throw new Error("ReaderConfigContext missing")
    return ctx
}

export const useReaderPlayback = () => {
    const ctx = useContext(ReaderPlaybackContext)
    if (!ctx) throw new Error("ReaderPlaybackContext missing")
    return ctx
}

export const useReader = () => ({
    ...useReaderConfig(),
    ...useReaderPlayback(),
})

export { ReaderConfigContext, ReaderPlaybackContext }
