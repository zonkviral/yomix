import { apiFetchHandler } from "@/utils/apiFetchHandler"
import { MangaStatistics } from "./types"
import { BASE_URL } from "./constants"

export const getMangaStatisticsBatch = async (
    ids: string[],
): Promise<Record<string, MangaStatistics>> => {
    if (ids.length === 0) return {}

    const query = ids.map((id) => `manga[]=${id}`).join("&")
    const data = await apiFetchHandler<{
        statistics: Record<string, MangaStatistics>
    }>(`${BASE_URL}/statistics/manga?${query}`)

    return data.statistics
}
