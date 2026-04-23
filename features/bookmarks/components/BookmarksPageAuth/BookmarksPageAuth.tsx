"use client"
import { useEffect } from "react"

import { BookmarksLayout } from "../BookmarksLayout/BookmarksLayout"

import { useBookmarksStore } from "../../store/bookmarks.store"

import { Bookmark, Collection, UserStats } from "@/lib/supabase/type"

interface BookmarksPageAuthProps {
    bookmarks: Bookmark[]
    stats: UserStats | null
    collections: Collection[]
}

export const BookmarksPageAuth = ({
    bookmarks,
    stats,
    collections,
}: BookmarksPageAuthProps) => {
    const { load } = useBookmarksStore()

    useEffect(() => load(bookmarks), [])

    const storeBookmarks = useBookmarksStore((s) => s.bookmarks)
    return (
        <BookmarksLayout
            bookmarks={storeBookmarks}
            collections={collections}
            stats={stats}
        />
    )
}
