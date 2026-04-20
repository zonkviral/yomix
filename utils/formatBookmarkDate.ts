export const formatBookmarkDate = (date: Date) => {
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))

    if (diffInMinutes < 1) {
        return "Только что"
    }
    if (diffInMinutes < 60) {
        return `${diffInMinutes} мин. назад`
    }
    if (diffInHours < 24) {
        return `${diffInHours} ч. назад`
    }
    if (diffInDays < 7) {
        return `${diffInDays} дн. назад`
    }
    return date.toLocaleDateString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    })
}
