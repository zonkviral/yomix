import type { Manga as MangaDexManga } from "@/lib/MangaDex/types"

export interface TitleInput {
    lang: string
    title: string
    is_original?: boolean
}

export function buildTitleList(manga: MangaDexManga): TitleInput[] {
    const originalLang = manga.attributes.originalLanguage
    const list: TitleInput[] = []
    const add = (lang: string, title: string) => {
        if (title) list.push({ lang, title, is_original: lang === originalLang })
    }

    for (const [lang, title] of Object.entries(manga.attributes.title)) add(lang, title)
    for (const alt of manga.attributes.altTitles)
        for (const [lang, title] of Object.entries(alt)) add(lang, title)

    return list
}

export function addRussianFallback(titles: TitleInput[], ru?: string | null): TitleInput[] {
    if (!ru || titles.some((t) => t.lang === "ru")) return titles
    return [...titles, { lang: "ru", title: ru }]
}

export function pickTitle(titles: TitleInput[], lang: string): string | null {
    const found =
        titles.find((t) => t.lang === lang) ?? titles.find((t) => t.lang === "en") ?? titles[0]
    return found?.title ?? null
}

interface TitleRow {
    manga_id: string
    lang: string
    title: string
    title_type: "original" | "alternative"
    is_primary: boolean
}

export function toTitleRows(mangaId: string, titles: TitleInput[]): TitleRow[] {
    const seenLang = new Set<string>()
    const seenPair = new Set<string>()
    const rows: TitleRow[] = []

    for (const t of titles.slice(0, 100)) {
        const lang = t.lang?.trim()
        const title = t.title?.trim()
        if (!lang || !title || lang.length > 16 || title.length > 500) continue

        const key = `${lang}|${title}`
        if (seenPair.has(key)) continue
        seenPair.add(key)

        rows.push({
            manga_id: mangaId,
            lang,
            title,
            title_type: t.is_original ? "original" : "alternative",
            is_primary: !seenLang.has(lang),
        })
        seenLang.add(lang)
    }
    return rows
}
