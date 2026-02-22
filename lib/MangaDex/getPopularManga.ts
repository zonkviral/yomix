import { BASE_URL } from "./constants"
import { Manga } from "./types"

export const getPopularManga = async (): Promise<Manga[]> => {
    const res = await fetch(
        `${BASE_URL}/manga?order[followedCount]=desc&limit=20&includes[]=cover_art&availableTranslatedLanguage[]=ru`,
        { cache: "force-cache" },
    )

    const data = await res.json()
    return data.data
}
