import { Bookmark } from "@/lib/supabase/type"

export const getLastChapter = (bookmark: Bookmark) =>
    bookmark.manga.reading_progress.at(-1)?.chapter_number ?? null

export const getExternalId = (bookmark: Bookmark) =>
    bookmark.manga.manga_sources?.[0]?.external_id || null

export const getTotalChapters = (bookmark: Bookmark) =>
    bookmark.manga.total_chapters || 0
