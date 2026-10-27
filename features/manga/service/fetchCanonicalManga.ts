import "server-only"

import { getMangaById } from "@/lib/MangaDex/getMangaById"
import { getMangaAggregate, getLastChapterNumber } from "@/lib/MangaDex/getMangaAggregate"
import { getAuthor } from "@/lib/MangaDex/helpers"
import { getCoverUrl } from "@/lib/MangaDex/getCoverUrl"
import type { Manga as MangaDexManga } from "@/lib/MangaDex/types"

import { findManga } from "@/lib/shikimori/findManga"

import { addRussianFallback, buildTitleList, pickTitle, type TitleInput } from "./titles"

export interface CanonicalManga {
    externalId: string
    author: string | null
    status: string | null
    coverUrl: string | null
    totalChapters: number | null
    genres: string[]
    titles: TitleInput[]
}

export function toCanonical(
    manga: MangaDexManga,
    extras: { totalChapters?: number | null; russianFallback?: string | null } = {},
): CanonicalManga {
    const author = getAuthor(manga)
    return {
        externalId: manga.id,
        author: author === "Unknown" ? null : author,
        status: manga.attributes.status,
        coverUrl: getCoverUrl(manga, 256),
        totalChapters: extras.totalChapters ?? null,
        genres: manga.attributes.tags
            .filter((tag) => tag.attributes.group === "genre")
            .map((tag) => tag.attributes.name.en)
            .filter(Boolean),
        titles: addRussianFallback(buildTitleList(manga), extras.russianFallback),
    }
}

export async function fetchCanonicalManga(externalId: string): Promise<CanonicalManga | null> {
    const [mangaDex, aggregate] = await Promise.all([
        getMangaById(externalId, { throwOnNotFound: true }).catch(() => null),
        getMangaAggregate(externalId).catch(() => null),
    ])
    if (!mangaDex) return null

    let russianFallback: string | null = null
    const titles = buildTitleList(mangaDex)
    if (!titles.some((t) => t.lang === "ru")) {
        const term = pickTitle(titles, "en") ?? titles[0]?.title
        russianFallback = (await findManga(term))?.russian ?? null // findManga never throws
    }

    const last = aggregate ? getLastChapterNumber(aggregate) : 0
    return toCanonical(mangaDex, { totalChapters: last > 0 ? last : null, russianFallback })
}
