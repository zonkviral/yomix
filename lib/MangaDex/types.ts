export interface MangaTitle {
    [lang: string]: string
}

export interface MangaAuthorRelationship {
    id: string
    type: "author" | "artist"
    attributes: {
        name: string
        biography: MangaTitle
        twitter: string | null
        website: string | null
        createdAt: string
        updatedAt: string
    }
}

export interface MangaCoverArt {
    id: string
    type: "cover_art"
    attributes: {
        fileName: string
        volume: string | null
        locale: string
        createdAt: string
    }
}

export interface MangaRelationship {
    id: string
    type: string
    related?: string
    attributes?: Record<string, unknown>
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
        lastChapter: string | null
        lastVolume: string | null
        contentRating: "safe" | "suggestive" | "erotica" | "pornographic"
        publicationDemographic: "shounen" | "shoujo" | "josei" | "seinen" | null
        originalLanguage: string
        tags: MangaTag[]
        availableTranslatedLanguages: string[]
        latestUploadedChapter: string | null
        state: "published" | "draft"
        updatedAt: string
        createdAt: string
    }
    relationships: (
        | MangaAuthorRelationship
        | MangaCoverArt
        | MangaRelationship
    )[]
}

export interface MangaTag {
    id: string
    type: "tag"
    attributes: {
        name: MangaTitle
        group: "genre" | "theme" | "format" | "content"
    }
}

export interface MangaResponse {
    data: Manga
    limit: number
    offset: number
    total: number
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
        updatedAt: string
        externalUrl: string | null
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
    comments: { threadId: number; repliesCount: number } | null
    follows: number
    rating: { average: number; bayesian: number }
}
