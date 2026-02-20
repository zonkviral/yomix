export interface MangaTitle {
    [lang: string]: string
}

export interface MangaCoverArt {
    id: string
    type: "cover_art"
    attributes: {
        fileName: string
    }
}

export interface MangaRelationship {
    id: string
    type: string
}

export interface Manga {
    id: string
    type: "manga"
    attributes: {
        title: MangaTitle
        altTitles: MangaTitle[]
        description: MangaTitle
        status: "ongoing" | "completed" | "hiatus" | "cancelled"
        year: number | null
        contentRating: "safe" | "suggestive" | "erotica" | "pornographic"
        tags: MangaTag[]
        availableTranslatedLanguages: string[]
    }
    relationships: (MangaCoverArt | MangaRelationship)[]
}

export interface MangaTag {
    id: string
    type: "tag"
    attributes: {
        name: MangaTitle
        group: string
    }
}

export interface MangaListResponse {
    data: Manga[]
    limit: number
    offset: number
    total: number
}

export interface Chapter {
    id: string
    type: "chapter"
    attributes: {
        title: string | null
        volume: string | null
        chapter: string | null
        translatedLanguage: string
        pages: number
        publishAt: string
    }
}

export interface ChapterPagesResponse {
    baseUrl: string
    chapter: {
        hash: string
        data: string[]
        dataSaver: string[]
    }
}

export interface MangaStatistics {
    comments: { threadId: number; repliesCount: number }
    follows: number
    rating: { average: number }
}
