import { getTitleFromAlt } from "./getTitleFromAlt"

export const getTitle = (
    title: Record<string, string>,
    altTitles: Record<string, string>[],
): string => {
    return (
        getTitleFromAlt(altTitles, "ru") ??
        title["ru"] ??
        getTitleFromAlt(altTitles, "en") ??
        title["en"] ??
        getTitleFromAlt(altTitles, "ja-ro") ??
        title["ja-ro"] ??
        Object.values(altTitles[0] ?? {})[0] ??
        Object.values(title)[0] ??
        "No title"
    )
}
