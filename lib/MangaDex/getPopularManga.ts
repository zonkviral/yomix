import { BASE_URL } from "./constants"

import { apiFetchHandler } from "@/utils/apiFetchHandler"

import { Manga, MangaListResponse } from "./types"

export const getPopularManga = async (): Promise<Manga[]> => {
    const data = await apiFetchHandler<MangaListResponse>(
        `${BASE_URL}/manga?order[followedCount]=desc&limit=20&includes[]=cover_art&availableTranslatedLanguage[]=ru`,
    )
    return data.data
}
