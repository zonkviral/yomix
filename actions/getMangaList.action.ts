"use server"

import { unstable_cache } from "next/cache"
import { getMangaList } from "@/lib/MangaDex/getMangaList"
import { fetchEnrichedManga } from "@/utils/fetchEnrichedManga"

export type { EnrichedManga } from "@/utils/fetchEnrichedManga"

const LIMIT = 10

export const getMangaListAction = unstable_cache(
    (page: number) =>
        fetchEnrichedManga(() => getMangaList(LIMIT, page * LIMIT)),
    ["manga-list"],
    { revalidate: 60 * 10 },
)
