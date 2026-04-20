import { Bookmark } from "../supabase/type"

export const getLastChapter = (bookmark: Bookmark) =>
    bookmark.reading_progress.at(-1)?.chapter_number ?? null
