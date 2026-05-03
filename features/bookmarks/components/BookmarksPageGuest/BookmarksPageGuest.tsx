"use client"
import { useEffect } from "react"
import { BookmarksLayout } from "../BookmarksLayout/BookmarksLayout"
import { useBookmarksStore } from "../../store/bookmarks.store"

export const BookmarksPageGuest = () => {
    const init = useBookmarksStore((s) => s.init)
    const bookmarks = useBookmarksStore((s) => s.bookmarks)
    const hydrated = useBookmarksStore((s) => s.hydrated)

    useEffect(() => {
        init(true)
    }, [])

    return (
        <BookmarksLayout
            bookmarks={bookmarks}
            showSavePrompt
            loading={!hydrated}
        />
    )
}
