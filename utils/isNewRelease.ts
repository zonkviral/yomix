export function isNewRelease(dateString: string | Date, daysThreshold = 3): boolean {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

    return diffInDays >= 0 && diffInDays < daysThreshold
}
