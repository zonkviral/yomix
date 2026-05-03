import { Bookmark } from "@/lib/supabase/type"

export const findByExternalId = (bookmarks: Bookmark[], externalId: string) =>
    bookmarks.find((b) =>
        b.manga.manga_sources?.some((ms) => ms.external_id === externalId),
    )

export const filterByExternalId = (bookmarks: Bookmark[], externalId: string) =>
    bookmarks.filter(
        (b) =>
            !b.manga.manga_sources?.some((ms) => ms.external_id === externalId),
    )

export const addToToggling = (set: Set<string>, id: string) => {
    const next = new Set(set)
    next.add(id)
    return next
}

export const removeFromToggling = (set: Set<string>, id: string) => {
    const next = new Set(set)
    next.delete(id)
    return next
}
