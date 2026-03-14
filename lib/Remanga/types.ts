interface Cover {
    high?: string
    low?: string
    mid?: string
}

export interface Publishers {
    cover: Cover
    dir: string
    name: string
    type: string
}

export interface SearchedManga {
    id: number
    count_chapters: number
    cover: Cover
    dir: string
    img: Cover
    rus_name: string
    main_name: string
}
interface IBranches {
    count_chapters: number
    id: number
}

interface FirstChapter {
    id: number
    tome: number
    chapter: string
}

export interface ReManga {
    another_name: string
    count_chapters: number
    id: number
    publishers: Publishers[]
    description: string
    has_anime: boolean
    branches: IBranches[]
    first_chapter: FirstChapter
    rus_name: string
    main_name: string
}
interface Page {
    link: string
    width: number
    height: number
    id: number
}
export interface RemangaResponse {
    content: ReManga
}
export interface SearchResponse {
    content: SearchedManga[]
}
export interface Chapter {
    chapter: number
    id: number
    pages: Array<Page[]>
}
