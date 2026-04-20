import { Suspense } from "react"

import { BookmarksPageGuest } from "@/features/bookmarks/components/BookmarksPageGuest/BookmarksPageGuest"
import { BookmarksPageAuth } from "@/features/bookmarks/components/BookmarksPageAuth/BookmarksPageAuth"
import { BookmarksSkeleton } from "@/features/bookmarks/components/BookmarksSkeleton/BookmarksSkeleton"

import { getUserBookmarks } from "@/lib/supabase/queries/bookmarks"
import { getUserCollections } from "@/lib/supabase/queries/collections"
import { getUserStats } from "@/lib/supabase/queries/stats"
import { createClient } from "@/lib/supabase/server"

const BookmarksContent = async () => {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) return <BookmarksPageGuest />

    const [bookmarks, stats, collections] = await Promise.all([
        getUserBookmarks(user.id),
        getUserStats(user.id),
        getUserCollections(user.id),
    ])

    return (
        <BookmarksPageAuth
            bookmarks={bookmarks}
            stats={stats}
            collections={collections}
        />
    )
}

const BookmarksPage = () => (
    <Suspense fallback={<BookmarksSkeleton />}>
        <BookmarksContent />
    </Suspense>
)

export default BookmarksPage
