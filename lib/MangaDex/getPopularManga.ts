import { BASE_URL } from "./constants"

export const getPopularManga = async () => {
    const res = await fetch(
        `${BASE_URL}/manga?order[followedCount]=desc&limit=20&includes[]=cover_art&availableTranslatedLanguage[]=ru`,
        { cache: "force-cache" },
    )

    const data = await res.json()
    return data
}
