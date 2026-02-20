export const getTitleFromAlt = (
    altTitles: Record<string, string>[],
    lang: string,
): string | undefined => {
    return altTitles.find((t) => t[lang])?.[lang]
}
