import { unstable_cache } from "next/cache"

import { getCoverUrl } from "@/lib/MangaDex/getCoverUrl"
import { getMangaStatisticsBatch } from "@/lib/MangaDex/getMangaStatisticsBatch"
import { searchMangaByName } from "@/lib/Remanga/searchMangaByName"
import { getMangaByName } from "@/lib/Remanga/getMangabyName"
import { getTitle } from "@/utils/getTitle"
import { htmlTagsRemover } from "@/utils/htmlTagsRemover"

import { Manga } from "@/lib/MangaDex/types"
import { ReManga } from "@/lib/Remanga/types"

export type EnrichedManga = {
    manga: Manga
    coverUrl: string | null
    titleDisplay: string
    description: string
    rating: number
    follows: number
}

const cachedSearchManga = unstable_cache(
    (name: string) => searchMangaByName(name),
    ["remanga-search"],
    { revalidate: 60 * 60 * 24 },
)

const cachedGetMangaByName = unstable_cache(
    (dir: string) => getMangaByName(dir),
    ["remanga-manga"],
    { revalidate: 60 * 60 * 24 },
)

const enrichOne = async (m: Manga): Promise<EnrichedManga> => {
    const coverUrl = getCoverUrl(m, 256)
    const titleRu = getTitle(m.attributes.title, m.attributes.altTitles, "ru")
    const titleEn = getTitle(m.attributes.title, m.attributes.altTitles, "en")
    const originalTitle = Object.values(m.attributes.title)[0]

    let mangaRu: ReManga | null = null
    if (!titleRu || !m.attributes.description["ru"]) {
        const searchResults = await cachedSearchManga(titleEn?.[0] ?? "")
        if (searchResults?.[0]?.dir) {
            mangaRu = await cachedGetMangaByName(searchResults[0].dir)
        }
    }

    const description = htmlTagsRemover(
        m.attributes.description["ru"] ??
            (mangaRu?.description || null) ??
            m.attributes.description["en"] ??
            "",
    )

    return {
        manga: m,
        coverUrl,
        titleDisplay: titleRu?.[0] ?? mangaRu?.rus_name ?? originalTitle ?? "",
        description,
        rating: 0,
        follows: 0,
    }
}

export const fetchEnrichedManga = async (
    fetcher: () => Promise<{ manga: Manga[]; total?: number }>,
): Promise<{ items: EnrichedManga[]; total?: number }> => {
    const { manga, total } = await fetcher()

    const [stats, enriched] = await Promise.all([
        getMangaStatisticsBatch(manga.map((m) => m.id)),
        Promise.all(manga.map(enrichOne)),
    ])

    const items = enriched.map((item) => {
        const stat = stats[item.manga.id]
        return {
            ...item,
            rating: stat?.rating?.average ?? 0,
            follows: stat?.follows ?? 0,
        }
    })

    return { items, total }
}
