// hooks/useBookmark.ts
"use client"

import { useBookmarksStore } from "../store/bookmarks.store"

import { Manga } from "@/lib/supabase/type"

export const useBookmark = (externalId: string, manga?: Manga) => {
    const isBookmarked = useBookmarksStore((s) => s.isBookmarked(externalId))
    const isToggling = useBookmarksStore((s) => s.toggling.has(externalId))
    const toggle = useBookmarksStore((s) => s.toggle)

    return {
        isBookmarked,
        isToggling,
        toggle: () => manga && toggle(externalId, manga),
    }
}
