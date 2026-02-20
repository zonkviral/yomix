import { BASE_URL } from "./constants"

export const getMangaList = async (limit = 5) => {
    if (!BASE_URL) return []
    const res = await fetch(
        `${BASE_URL}/manga?limit=${limit}&includes[]=cover_art&availableTranslatedLanguage[]=ru`,
    )

    if (!res.ok) {
        throw new Error("Failed to fetch manga")
    }

    const data = await res.json()
    return data
}
