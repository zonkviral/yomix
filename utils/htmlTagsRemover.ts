export const htmlTagsRemover = (html: string): string => {
    if (!html) return ""

    return html
        .replace(/<a[^>]*>(.*?)<\/a>/gi, "$1")
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/<\/p>/gi, "\n")
        .replace(/<[^>]+>/g, "")
        .replace(/&[a-z0-9#]+;/gi, " ")
        .replace(/[*_]{1,3}/g, "")
        .replace(/\n{2,}/g, "\n")
        .replace(/[ \t]{2,}/g, " ")
        .trim()
}
