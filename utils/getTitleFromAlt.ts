export const getTitleFromAlt = (
    altTitles: Record<string, string>[],
    lang: string,
): string[] => {
    return altTitles.filter((t) => t[lang]).map((t) => t[lang])
}
