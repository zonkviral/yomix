import { apiFetchHandler } from "@/utils/apiFetchHandler"
import { REMANGA_URL } from "./constants"
import { ReManga, RemangaResponse } from "./types"

export const getMangaByName = async (slug: string): Promise<ReManga | null> => {
    try {
        const data = await apiFetchHandler<RemangaResponse>(
            `${REMANGA_URL}/api/titles/${slug}/`,
        )
        return data.content ?? null
    } catch {
        return null
    }
}
