import { getTitleFromAlt } from "./getTitleFromAlt"

export const getTitle = (
    title: Record<string, string>,
    altTitles: Record<string, string>[],
    lang: string,
): string[] | undefined => {
    if (lang) {
        const titles = [
            title[lang],
            ...getTitleFromAlt(altTitles, lang),
        ].filter(Boolean) as string[]
        if (titles.length > 0) return titles
        return undefined
    }
}
