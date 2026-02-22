import { BASE_URL } from "./constants"

export const getMangaChapters = async (id: string) => {
    const res = await fetch(
        `${BASE_URL}/chapter?manga=${id}&order[chapter]=desc&limit=500`,
    )
    const data = await res.json()
    return data
}
