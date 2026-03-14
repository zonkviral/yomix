import { apiFetchHandler } from "@/utils/apiFetchHandler"
import { REMANGA_URL } from "./constants"
import { SearchedManga, SearchResponse } from "./types"

export const searchMangaByName = async (
    slug: string,
): Promise<SearchedManga[] | null> => {
    try {
        const data = await apiFetchHandler<SearchResponse>(
            `${REMANGA_URL}/api/search/?query=${encodeURIComponent(slug)}/`,
        )
        return data.content ?? null
    } catch {
        return null
    }
}
