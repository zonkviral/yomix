// BookmarksPageGuest.tsx
"use client"
import { useEffect, useState } from "react"

import { BookmarksLayout } from "../BookmarksLayout/BookmarksLayout"
import { RecentlySection } from "../RecentlySection/RecentlySection"

import { getLocalBookmarks, LocalBookmark } from "../../services/local-storage"

export const BookmarksPageGuest = () => {
    const [bookmarks, setBookmarks] = useState<LocalBookmark[]>([])

    useEffect(() => {
        setBookmarks(getLocalBookmarks())
    }, [])

    const recentlyAdded = [...bookmarks]
        .sort(
            (a, b) =>
                new Date(b.updated_at).getTime() -
                new Date(a.updated_at).getTime(),
        )
        .slice(0, 4)

    return (
        <BookmarksLayout
            bookmarks={bookmarks}
            sidebar={
                <>
                    <div className="rounded bg-neutral-900 p-4">
                        <h2 className="text-lg font-bold">
                            Сохраните закладки
                        </h2>
                        <p className="mt-2 text-sm text-gray-500">
                            Войдите чтобы синхронизировать закладки между
                            устройствами.
                        </p>
                    </div>
                    {recentlyAdded.length > 0 && (
                        <RecentlySection bookmarks={recentlyAdded} />
                    )}
                </>
            }
        />
    )
}
