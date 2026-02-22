import { BASE_URL } from "./constants"

import { apiFetchHandler } from "@/utils/apiFetchHandler"

export const getMangaChapters = async (id: string) => {
    const data = await apiFetchHandler(
        `${BASE_URL}/chapter?manga=${id}&order[chapter]=desc&limit=500`,
    )
    return data
}
