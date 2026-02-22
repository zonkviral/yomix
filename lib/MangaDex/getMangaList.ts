import { BASE_URL } from "./constants"
import { Manga } from "./types"

export const getMangaList = async (limit = 10): Promise<Manga[] | []> => {
    if (!BASE_URL) return []
    const res = await fetch(
        `${BASE_URL}/manga?limit=${limit}&includes[]=cover_art&availableTranslatedLanguage[]=ru`,
    )

    if (!res.ok) {
        throw new Error("Failed to fetch manga")
    }

    const data = await res.json()
    return data.data
}
