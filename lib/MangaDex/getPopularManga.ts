import { unstable_cache } from "next/cache"
import { BASE_URL } from "./constants"
import { apiFetchHandler } from "@/utils/apiFetchHandler"
import { Manga, MangaListResponse } from "./types"

const fetchPopularManga = async (): Promise<Manga[]> => {
    const data = await apiFetchHandler<MangaListResponse>(
        `${BASE_URL}/manga?order[followedCount]=desc&limit=20&includes[]=cover_art&availableTranslatedLanguage[]=ru`,
    )
    return data.data
}

export const getPopularManga = unstable_cache(
    fetchPopularManga,
    ["popular-manga"],
    { revalidate: 60 * 60 },
)
