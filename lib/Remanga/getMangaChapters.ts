import { REMANGA_URL } from "./constants"

import { apiFetchHandler } from "@/utils/apiFetchHandler"
import { Chapter } from "./types"
interface ChapterResponse {
    content: Chapter
}
export const getMangaChapters = async (id: string): Promise<Chapter> => {
    const data = await apiFetchHandler<ChapterResponse>(
        `${REMANGA_URL}/api/titles/chapters/${id}/`,
    )
    return data.content
}
