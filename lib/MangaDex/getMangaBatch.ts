import { BASE_URL } from "./constants"

import { apiFetchHandler } from "@/utils/apiFetchHandler"

import { Manga, MangaListResponse } from "./types"

const BATCH_SIZE = 100

export const getMangaBatch = async (ids: string[]): Promise<Manga[]> => {
    const results: Manga[] = []

    for (let i = 0; i < ids.length; i += BATCH_SIZE) {
        const params = new URLSearchParams()
        ids.slice(i, i + BATCH_SIZE).forEach((id) => params.append("ids[]", id))
        params.set("limit", String(BATCH_SIZE))
        for (const v of ["cover_art", "author", "artist"]) params.append("includes[]", v)
        for (const v of ["safe", "suggestive", "erotica", "pornographic"])
            params.append("contentRating[]", v)

        const data = await apiFetchHandler<MangaListResponse>(
            `${BASE_URL}/manga?${params}`,
            undefined,
            { throwOnNotFound: true },
        )
        results.push(...data.data.map((m) => ({ ...m, source: "mangadex" })))
    }
    return results
}
