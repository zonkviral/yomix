import { unstable_cache } from "next/cache"
import { apiFetchHandler } from "@/utils/apiFetchHandler"

import { BASE_URL } from "./constants"

import { Manga, MangaListResponse } from "./types"

const fetchNewestManga = async (): Promise<{ manga: Manga[] }> => {
    const data = await apiFetchHandler<MangaListResponse>(
        `${BASE_URL}/manga?order[createdAt]=desc&limit=16&includes[]=cover_art&availableTranslatedLanguage[]=ru`,
    )
    return { manga: data.data }
}

export const getNewestManga = unstable_cache(
    fetchNewestManga,
    ["newest-manga"],
    { revalidate: 60 * 10 },
)
