import { ReaderBgColor, ReaderFilter, ReadingMode } from "./ReaderContext"

export const FILTER_MAP: Record<ReaderFilter, string> = {
    default: "none",
    warm: "sepia(0.3) brightness(1.05)",
    brightness: "brightness(0.75)",
    invert: "invert(1)",
}

export const FILTER_OPTIONS = [
    { label: "None", value: "default" },
    { label: "Warm", value: "warm" },
    { label: "Invert", value: "invert" },
    { label: "Bright", value: "brightness" },
] satisfies { label: string; value: ReaderFilter }[]

export const BG_COLORS = [
    { label: "Default", value: "default" },
    { label: "Black", value: "black" },
    { label: "Sepia", value: "sepia" },
    { label: "Gray", value: "gray" },
] satisfies { label: string; value: ReaderBgColor }[]

export const BG_COLOR_MAP: Record<ReaderBgColor, string> = {
    default: "#0d0f14",
    black: "#000000",
    sepia: "#2b2318",
    gray: "#1a1a1a",
}
export const READING_MODES = [
    { label: "Single", value: "single" },
    { label: "Book", value: "book" },
    { label: "Webtoon", value: "webtoon" },
] satisfies { label: string; value: ReadingMode }[]
