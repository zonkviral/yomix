import { BASE_URL } from "./constants"

import { apiFetchHandler } from "@/utils/apiFetchHandler"

import { Chapter } from "./types"

interface Response {
    data: Chapter[]
}

export const getMangaChaptersList = async (id: string) => {
    const data = await apiFetchHandler<Response>(
        `${BASE_URL}/manga/${id}/feed?translatedLanguage[]=ru&order[chapter]=asc&limit=500`,
    )
    return data.data
}
