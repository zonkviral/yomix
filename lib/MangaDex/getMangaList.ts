import { BASE_URL } from "./constants"

import { apiFetchHandler } from "@/utils/apiFetchHandler"

import { Manga, MangaListResponse } from "./types"

export type MangaPage = {
    manga: Manga[]
    total: number
}

export const getMangaList = async (
    limit = 10,
    offset = 0,
): Promise<MangaPage> => {
    const data = await apiFetchHandler<MangaListResponse>(
        `${BASE_URL}/manga?limit=${limit}&offset=${offset}&includes[]=cover_art&availableTranslatedLanguage[]=ru`,
    )
    return { manga: data.data, total: data.total }
}
