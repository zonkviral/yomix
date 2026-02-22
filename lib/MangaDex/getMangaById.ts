import { BASE_URL } from "./constants"

import { apiFetchHandler } from "@/utils/apiFetchHandler"

import { Manga, MangaResponse } from "./types"

export const getMangaById = async (id: string): Promise<Manga> => {
    const data = await apiFetchHandler<MangaResponse>(
        `${BASE_URL}/manga/${id}?includes[]=cover_art&includes[]=author&includes[]=artist`,
    )
    return data.data
}
