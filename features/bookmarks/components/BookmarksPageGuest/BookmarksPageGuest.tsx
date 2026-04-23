// BookmarksPageGuest.tsx
"use client"
import { useEffect, useState } from "react"

import { BookmarksLayout } from "../BookmarksLayout/BookmarksLayout"

import { getLocalBookmarks } from "../../services/local-storage"

import { useBookmarksStore } from "../../store/bookmarks.store"

export const BookmarksPageGuest = () => {
    const { bookmarks, load, setGuest } = useBookmarksStore()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setGuest(true)
        load(getLocalBookmarks())
        setLoading(false)
    }, [load, setGuest])

    return (
        <>
            <BookmarksLayout
                bookmarks={bookmarks}
                showSavePrompt
                loading={loading}
            />
        </>
    )
}
