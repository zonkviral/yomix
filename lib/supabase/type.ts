export type ReadStatus =
    | "reading"
    | "on_hold"
    | "completed"
    | "dropped"
    | "plan_to_read"

export interface UserStats {
    total_chapters?: number
    total_manga_reading: number
    total_manga_completed: number
}

export interface Manga {
    id: string
    title: string
    manga_sources: MangaSource[]
    cover_url?: string
    cached_at?: string
    author?: string
    status?: string
    total_chapters?: number
    reading_progress: ReadingProgress[]
}

export interface Collection {
    id: string
    name: string
    is_public: boolean
    position: number
}

export interface ReadingProgress {
    chapter_number: number
    chapter_id: string
    page_number?: number
    read_at?: string
    updated_at?: string
}

export interface Bookmark {
    id: string
    read_status: ReadStatus
    score?: number
    completed_at?: string
    started_at?: string
    updated_at: string
    created_at: string
    manga: Manga
}
export interface MangaInfo {
    author: string
    artist: string
    status: string
    year: number | null
    tags: string[]
    languages: string[]
}

export interface MangaSource {
    id: string
    manga_id: string
    source: string
    external_id: string
}
