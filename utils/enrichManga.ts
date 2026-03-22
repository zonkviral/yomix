import { unstable_cache } from "next/cache"

import { getCoverUrl } from "@/lib/MangaDex/getCoverUrl"
import { getMangaStatisticsBatch } from "@/lib/MangaDex/getMangaStatisticsBatch"
import { searchMangaByName } from "@/lib/Remanga/searchMangaByName"
import { getMangaByName } from "@/lib/Remanga/getMangabyName"
import { Manga } from "@/lib/MangaDex/types"
import { ReManga } from "@/lib/Remanga/types"

import { getTitle } from "@/utils/getTitle"
import { htmlTagsRemover } from "@/utils/htmlTagsRemover"

export type MangaWithCover = {
    manga: Manga
    coverUrl: string | null
}

export type MangaWithTitle = MangaWithCover & {
    titleDisplay: string
}

export type EnrichedManga = MangaWithTitle & {
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

export const withCover = (manga: Manga): MangaWithCover => ({
    manga,
    coverUrl: getCoverUrl(manga, 256),
})

export const withTitle = (manga: Manga): string => {
    const titleRu = getTitle(
        manga.attributes.title,
        manga.attributes.altTitles,
        "ru",
    )
    const titleEn = getTitle(
        manga.attributes.title,
        manga.attributes.altTitles,
        "en",
    )
    return (
        titleRu?.[0] ??
        titleEn?.[0] ??
        Object.values(manga.attributes.title)[0] ??
        ""
    )
}

const getRemangaData = async (manga: Manga): Promise<ReManga | null> => {
    const titleRu = getTitle(
        manga.attributes.title,
        manga.attributes.altTitles,
        "ru",
    )
    const titleEn = getTitle(
        manga.attributes.title,
        manga.attributes.altTitles,
        "en",
    )
    if (titleRu && manga.attributes.description["ru"]) return null
    const searchResults = await cachedSearchManga(titleEn?.[0] ?? "")
    if (!searchResults?.[0]?.dir) return null
    return cachedGetMangaByName(searchResults[0].dir)
}

const enrichOne = async (manga: Manga): Promise<EnrichedManga> => {
    const remanga = await getRemangaData(manga)
    const titleRu = getTitle(
        manga.attributes.title,
        manga.attributes.altTitles,
        "ru",
    )
    const originalTitle = Object.values(manga.attributes.title)[0]

    const description = htmlTagsRemover(
        manga.attributes.description["ru"] ??
            remanga?.description ??
            manga.attributes.description["en"] ??
            "",
    )

    return {
        manga,
        coverUrl: getCoverUrl(manga, 256),
        titleDisplay: titleRu?.[0] ?? remanga?.rus_name ?? originalTitle ?? "",
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

export const fetchLightManga = (manga: Manga[]): MangaWithTitle[] =>
    manga.map((m) => ({
        ...withCover(m),
        titleDisplay: withTitle(m),
    }))
