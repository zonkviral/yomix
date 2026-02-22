import { REMANGA_URL } from "./constants"
import { ISearchedManga } from "./types"

export const searchMangaByName = async (
    slug: string,
): Promise<ISearchedManga[]> => {
    const res = await fetch(
        `${REMANGA_URL}/api/search/?query=${encodeURIComponent(slug)}/`,
    )
    const data = await res.json()
    return data.content
}
