import type { ChapterSource } from "@/lib/chapters/types"

import type { ReadStatus } from "./type"

export const READ_STATUSES: readonly ReadStatus[] = [
    "reading",
    "completed",
    "plan_to_read",
    "dropped",
    "on_hold",
]
export const CHAPTER_SOURCES: readonly ChapterSource[] = [
    "mangadex",
    "remanga",
    "mangalib",
    "senkuro",
]
export const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
