import { Suspense } from "react"
import { BookmarksPageGuest } from "@/features/bookmarks/components/BookmarksPageGuest/BookmarksPageGuest"
import { BookmarksPageAuth } from "@/features/bookmarks/components/BookmarksPageAuth/BookmarksPageAuth"
import { BookmarksSkeleton } from "@/features/bookmarks/components/BookmarksSkeleton/BookmarksSkeleton"

import { getBookmarkStatusCounts } from "@/lib/supabase/queries/getBookmarksCounts"
import { getUserCollections } from "@/lib/supabase/queries/collections"
import { getUserStats } from "@/lib/supabase/queries/stats"
import { createClient } from "@/lib/supabase/server"
import { getContinueReading } from "@/lib/supabase/queries/continue-reading"
import { getRecentlyAdded } from "@/lib/supabase/queries/recently-added"

const BookmarksContent = async () => {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) return <BookmarksPageGuest />

    const [continueReading, recentlyAdded, stats, collections, statusCounts] =
        await Promise.all([
            getContinueReading(user.id),
            getRecentlyAdded(user.id),
            getUserStats(user.id),
            getUserCollections(user.id),
            getBookmarkStatusCounts(user.id),
        ])
    return (
        <BookmarksPageAuth
            continueReading={continueReading}
            recentlyAdded={recentlyAdded}
            stats={stats}
            collections={collections}
            statusCounts={statusCounts}
        />
    )
}

const BookmarksPage = () => (
    <Suspense fallback={<BookmarksSkeleton sidebar />}>
        <BookmarksContent />
    </Suspense>
)

export default BookmarksPage
