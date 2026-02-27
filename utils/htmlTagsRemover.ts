export const htmlTagsRemover = (html: string): string => {
    if (!html) return ""

    return html
        .replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, "$2")
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/<\/p>/gi, "\n")
        .replace(/<[^>]+>/g, "")
        .replace(/\n\s*\n/g, "\n")
        .replace(/[ \t]+/g, " ")
        .trim()
}
