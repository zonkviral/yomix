import { BASE_URL } from "./constants"

export const getMangaStatistics = async (id: string) => {
    const res = await fetch(`${BASE_URL}/statistics/manga/${id}`)
    const data = await res.json()
    return data.statistics[id]
}
