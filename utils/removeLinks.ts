export const removeLinks = (description: string) => {
    return description.replace(/---[\s\S]*/i, "").trim()
}
