import { BASE_URL } from "./constants"

import { apiFetchHandler } from "@/utils/apiFetchHandler"

import { MangaListResponse } from "./types"

export const getSearchResult = async (title: string) => {
    const data = await apiFetchHandler<MangaListResponse>(
        `${BASE_URL}/manga?title=${title}&limit=8&includes[]=cover_art&availableTranslatedLanguage[]=ru`,
    )
    return data.data
}
