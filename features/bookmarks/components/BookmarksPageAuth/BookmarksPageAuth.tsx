"use client"

import { useEffect } from "react"

import { BookmarksLayout } from "../BookmarksLayout/BookmarksLayout"

import { useBookmarksStore } from "../../store/bookmarks.store"

import { Bookmark, Collection } from "@/lib/supabase/type"

interface BookmarksPageAuthProps {
    bookmarks: Bookmark[]
    stats: { total_chapters: number } | null
    collections: Collection[]
}

export const BookmarksPageAuth = ({
    bookmarks,
    stats,
    collections,
}: BookmarksPageAuthProps) => {
    const init = useBookmarksStore((s) => s.init)
    const storeBookmarks = useBookmarksStore((s) => s.bookmarks)
    const hydrated = useBookmarksStore((s) => s.hydrated)

    useEffect(() => {
        init(false, bookmarks)
    }, [bookmarks])
    console.log("BookmarksPageAuth render", { bookmarks, storeBookmarks })
    console.log("BookmarksPageAuth render stats", stats)
    console.log(
        "server bookmarks progress",
        bookmarks.map((b) => ({
            title: b.manga.title,
            progress: b.manga.reading_progress,
        })),
    )
    return (
        <BookmarksLayout
            bookmarks={storeBookmarks}
            collections={collections}
            stats={stats}
            loading={!hydrated}
        />
    )
}
