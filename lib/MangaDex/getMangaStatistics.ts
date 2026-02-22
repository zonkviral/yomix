import { BASE_URL } from "./constants"
import { MangaStatistics } from "./types"

export const getMangaStatistics = async (
    id: string,
): Promise<MangaStatistics> => {
    const res = await fetch(`${BASE_URL}/statistics/manga/${id}`)
    const data = await res.json()
    return data.statistics[id]
}
