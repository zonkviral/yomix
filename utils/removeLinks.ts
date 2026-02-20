export const removeLinks = (description: string) => {
    if (!description) return ""
    return description.replace(/---[\s\S]*/i, "").trim()
}
