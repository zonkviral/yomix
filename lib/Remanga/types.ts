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

export interface ISearchedManga {
    id: number
    count_chapters: number
    cover: Cover
    dir: string
    img: Cover
}

export interface IReManga {
    another_name: string
    count_chapters: number
    id: number
    publishers: Publishers[]
    description: string
    has_anime: boolean
}
