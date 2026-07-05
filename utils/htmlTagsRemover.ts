export const htmlTagsRemover = (html: string): string => {
    if (!html) return ""

    const dividerIndex = html.search(/-{3,}/)
    const body = dividerIndex !== -1 ? html.slice(0, dividerIndex) : html

    return (
        body
            // markdown images
            .replace(/!\[([^\]]*)\]\((?:[^()]|\([^()]*\))*\)/g, "")
            // markdown links
            .replace(/\[([^\]]*)\]\((?:[^()]|\([^()]*\))*\)/g, "$1")
            // HTML anchor tags
            .replace(/<a[^>]*>(.*?)<\/a>/gi, "$1")
            .replace(/<br\s*\/?>/gi, "\n")
            .replace(/<\/p>/gi, "\n")
            .replace(/<[^>]+>/g, "")
            // markdown headings
            .replace(/^#{1,6}\s+/gm, "")
            // markdown blockquote markers
            .replace(/^>\s?/gm, "")
            // markdown list bullets
            .replace(/^[ \t]*[-*+]\s+/gm, "")
            .replace(/&[a-z0-9#]+;/gi, " ")
            .replace(/[*_]{1,3}/g, "")
            .replace(/\n{2,}/g, "\n")
            .replace(/[ \t]{2,}/g, " ")
            .trim()
    )
}
