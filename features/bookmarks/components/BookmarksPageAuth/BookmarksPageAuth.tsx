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
    const init = useBookmarksStore((s) => s.init)
    const storeBookmarks = useBookmarksStore((s) => s.bookmarks)

    useEffect(() => {
        init(false, bookmarks)
    }, [])

    return (
        <BookmarksLayout
            bookmarks={storeBookmarks.length > 0 ? storeBookmarks : bookmarks}
            collections={collections}
            stats={stats}
        />
    )
}
