import { BookmarkCard } from "../../components/BookmarkCard/BookmarkCard"
import { BookmarkRow } from "../../components/BookmarkRow/BookmarkRow"
import { StatsSection } from "../StatsSection/StatsSection"
import { RecentlySection } from "../RecentlySection/RecentlySection"
import { CollectionsSection } from "../CollectionsSection/CollectionsSection"
import { SideSectionWrapper } from "../SideSectionWrapper/SideSectionWrapper"
import { BookmarksSkeleton } from "../BookmarksSkeleton/BookmarksSkeleton"

import { CarouselWrapper } from "@/components/ui/CarouselWrapper/CarouselWrapper"
import { List } from "@/components/ui/List/List"

import { Bookmark, Collection, UserStats } from "@/lib/supabase/type"

import { BookAlert } from "lucide-react"

interface BookmarksLayoutProps {
    bookmarks: Bookmark[]
    collections?: Collection[]
    showSavePrompt?: boolean
    stats?: UserStats | null
    loading?: boolean
}

export const BookmarksLayout = ({
    bookmarks,
    collections,
    showSavePrompt = false,
    stats,
    loading = false,
}: BookmarksLayoutProps) => {
    const continueReading = [...bookmarks]
        .filter((b) => b.reading_progress.length > 0)
        .sort(
            (a, b) =>
                new Date(b.updated_at).getTime() -
                new Date(a.updated_at).getTime(),
        )
        .slice(0, 10)
    const recentlyAdded = bookmarks.slice(0, 4)

    return (
        <div className="grid grid-cols-[1fr_17.5rem] gap-8 p-4">
            <div className="flex min-w-0 grow flex-col gap-5">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-1">
                        <h1 className="text-2xl font-bold">Закладки</h1>
                        <span className="rounded bg-[#17151a] px-1 py-px text-rose-500/80">
                            {bookmarks.length}
                        </span>
                    </div>
                    {bookmarks.length === 0 && (
                        <p className="text-sm text-gray-500">
                            Здесь будут отображаться все ваши закладки.
                        </p>
                    )}
                </div>
                {loading && <BookmarksSkeleton rowBookmarks={false} />}

                {continueReading.length > 0 && (
                    <section>
                        <h2 className="text-xl">Продолжить читать</h2>
                        <CarouselWrapper autoplay={false} loop={false}>
                            <List
                                className="mt-4 flex gap-4"
                                items={continueReading}
                                renderItem={(bookmark) => (
                                    <BookmarkCard bookmark={bookmark} />
                                )}
                            />
                        </CarouselWrapper>
                    </section>
                )}

                <section className="my-6">
                    <h2 className="text-xl">Все закладки</h2>
                    {bookmarks.length > 0 ? (
                        <List
                            className="mt-4 grid grid-cols-1 gap-2 md:grid-cols-2 2xl:grid-cols-3"
                            items={bookmarks}
                            renderItem={(bookmark) => (
                                <BookmarkRow bookmark={bookmark} />
                            )}
                        />
                    ) : (
                        <p className="mt-2 text-sm text-gray-500">
                            Нет закладок. Добавьте мангу в закладки.
                        </p>
                    )}
                    {loading && <BookmarksSkeleton colBookmarks={false} />}
                </section>
            </div>
            <div className="ml-auto flex w-70 flex-col gap-4">
                {showSavePrompt && (
                    <SideSectionWrapper
                        title="Перенесите библиотеку"
                        icon={
                            <BookAlert className="float-left mt-0.5 mr-1 w-5" />
                        }
                    >
                        <p className="mt-2 text-sm text-gray-500">
                            Войдите в аккаунт, чтобы ваши закладки были доступны
                            везде. Без аккаунта данные могут удалиться при
                            очистке кеша.
                        </p>
                    </SideSectionWrapper>
                )}
                {stats && (
                    <StatsSection
                        stats={{
                            total_manga: stats?.total_manga ?? 0,
                            total_chapters: stats?.total_chapters ?? 0,
                            total_time_mins: stats?.total_time_mins ?? 0,
                        }}
                    />
                )}
                <CollectionsSection
                    collections={collections}
                    bookmarks={bookmarks}
                />
                {bookmarks.length > 0 && (
                    <RecentlySection bookmarks={recentlyAdded} />
                )}
            </div>
        </div>
    )
}
