import { BASE_URL } from "./constants"

import { apiFetchHandler } from "@/utils/apiFetchHandler"

import { MangaStatistics } from "./types"

export const getMangaStatistics = async (
    id: string,
): Promise<MangaStatistics> => {
    const data = await apiFetchHandler<{
        statistics: Record<string, MangaStatistics>
    }>(`${BASE_URL}/statistics/manga/${id}`)
    return data.statistics[id]
}
