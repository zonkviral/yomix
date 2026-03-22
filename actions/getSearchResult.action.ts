"use server"

import { getSearchResult } from "@/lib/MangaDex/getSearchResult"

import { fetchLightManga, MangaWithTitle } from "@/utils/enrichManga"

export type SearchResult = MangaWithTitle

export const getSearchResultAction = async (title: string) => {
    const result = await getSearchResult(title)
    return { result: fetchLightManga(result) }
}
