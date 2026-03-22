const KEY = "recent-searches"
const MAX = 3

export const getRecentSearches = (): string[] => {
    if (typeof window === "undefined") return []
    return JSON.parse(localStorage.getItem(KEY) ?? "[]")
}

export const addRecentSearch = (query: string) => {
    const prev = getRecentSearches()
    const updated = [query, ...prev.filter((q) => q !== query)].slice(0, MAX)
    localStorage.setItem(KEY, JSON.stringify(updated))
}

export const removeRecentSearch = (query: string) => {
    const updated = getRecentSearches().filter((q) => q !== query)
    localStorage.setItem(KEY, JSON.stringify(updated))
}
