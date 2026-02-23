import { BASE_URL } from "./constants"

import { apiFetchHandler } from "@/utils/apiFetchHandler"
import { ChapterPagesResponse } from "./types"

export const getMangaChapter = async (
    chapterId: string,
): Promise<ChapterPagesResponse> => {
    const data = await apiFetchHandler<ChapterPagesResponse>(
        `${BASE_URL}/at-home/server/${chapterId}`,
    )
    return data
}
