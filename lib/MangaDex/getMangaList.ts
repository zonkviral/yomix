import { BASE_URL } from "./constants"

import { apiFetchHandler } from "@/utils/apiFetchHandler"

import { Manga, MangaListResponse } from "./types"

export const getMangaList = async (limit = 10): Promise<Manga[] | []> => {
    const data = await apiFetchHandler<MangaListResponse>(
        `${BASE_URL}/manga?limit=${limit}&includes[]=cover_art&availableTranslatedLanguage[]=ru`,
    )
    return data.data
}
