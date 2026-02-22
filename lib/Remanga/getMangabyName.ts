import { REMANGA_URL } from "./constants"
import { IReManga } from "./types"

export const getMangaByName = async (slug: string): Promise<IReManga> => {
    const res = await fetch(`${REMANGA_URL}/api/titles/${slug}/`)
    const data = await res.json()
    return data.content
}
