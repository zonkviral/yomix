import { Bookmark } from "@/lib/supabase/type"

export const getLastChapter = (bookmark: Bookmark) =>
    bookmark.manga?.reading_progress[0]?.chapter_number || 0

export const getLastPage = (bookmark: Bookmark) =>
    bookmark.manga?.reading_progress[0]?.page_number || 0

export const getLastChapterId = (bookmark: Bookmark) =>
    bookmark.manga?.reading_progress?.[0]?.chapter_id || null

export const getExternalId = (bookmark: Bookmark) => bookmark.manga?.external_id ?? null

export const getTotalChapters = (bookmark: Bookmark) => bookmark.manga?.total_chapters || 0
