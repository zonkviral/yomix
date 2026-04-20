export interface UserStats {
    total_chapters: number
    total_time_mins: number
    total_manga: number
}

export interface Manga {
    id: string
    title: string
    cover_url: string | null
    total_chapters: number | null
}

export interface Collection {
    id: string
    name: string
    is_public: boolean
    position: number
}

export interface ReadingProgress {
    user_id: string
    manga_id: string
    chapter_number: number
    page_number?: number
    read_at?: string
    updated_at?: string
}

export interface Bookmark {
    id: string
    read_status: string
    score: number | null
    updated_at: string
    manga: Manga[]
    reading_progress: ReadingProgress[]
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
    externalId: string
    source: string
    title: string
    coverUrl: string
    totalChapters?: number
}
