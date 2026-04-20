import { BookmarksLayout } from "../BookmarksLayout/BookmarksLayout"
import { CollectionsSection } from "../CollectionsSection/CollectionsSection"
import { RecentlySection } from "../RecentlySection/RecentlySection"
import { StatsSection } from "../StatsSection/StatsSection"

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
                    <StatsSection
                        stats={{
                            total_manga: stats?.total_manga ?? 0,
                            total_chapters: stats?.total_chapters ?? 0,
                            total_time_mins: stats?.total_time_mins ?? 0,
                        }}
                    />
                    {collections.length > 0 && (
                        <CollectionsSection collections={collections} />
                    )}
                    {recentlyAdded.length > 0 && (
                        <RecentlySection bookmarks={recentlyAdded} />
                    )}
                </>
            }
        />
    )
}
