import { BASE_URL } from "./constants"
import { Manga } from "./types"

export const getMangaById = async (id: string): Promise<Manga> => {
    const res = await fetch(
        `${BASE_URL}/manga/${id}?includes[]=cover_art&includes[]=author&includes[]=artist`,
    )
    const data = await res.json()
    return data.data
}
