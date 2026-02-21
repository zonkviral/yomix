export const removeLinks = (text: string) => {
    if (!text) return ""
    return text
        .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // [text](url) → text
        .replace(/<a[^>]*>(.*?)<\/a>/gi, "$1") // <a href="">text</a> → text
        .replace(/---/g, "") // remove ---
        .replace(/\*\*(.+?)\*\*/g, "$1") // **bold** → text
        .replace(/\*(.+?)\*/g, "$1") // *italic* → text
        .replace(/#{1,6}\s/g, "") // ## headings → text
        .replace(/^\s*-\s+.*/gm, "") // - list items → remove entire line
        .trim()
}
