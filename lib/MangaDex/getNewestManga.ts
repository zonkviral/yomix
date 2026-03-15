import { apiFetchHandler } from "@/utils/apiFetchHandler"

import { BASE_URL } from "./constants"

import { Manga, MangaListResponse } from "./types"

export const getNewestManga = async (): Promise<{
    manga: Manga[]
}> => {
    const data = await apiFetchHandler<MangaListResponse>(
        `${BASE_URL}/manga?order[createdAt]=desc&limit=16&includes[]=cover_art&availableTranslatedLanguage[]=ru`,
    )
    return { manga: data.data }
}
