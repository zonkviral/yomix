"use client"

import { CarouselWrapper } from "@/components/ui/CarouselWrapper/CarouselWrapper"
import { List } from "@/components/ui/List/List"
import { Pagination } from "@/components/ui/Pagination/Pagination"

import { BookmarkCard } from "../BookmarkCard/BookmarkCard"
import { BookmarkRow } from "../BookmarkRow/BookmarkRow"
import { StatsSection } from "../StatsSection/StatsSection"
import { RecentlySection } from "../RecentlySection/RecentlySection"
import { CollectionsSection } from "../Collection/CollectionsSection/CollectionsSection"
import { SideSectionWrapper } from "../SideSectionWrapper/SideSectionWrapper"
import { BookmarksSkeleton } from "../BookmarksSkeleton/BookmarksSkeleton"
import { BookmarksFilters } from "../BookmarksFilters/BookmarksFilters"

import { Bookmark, Collection } from "@/lib/supabase/type"
import { BookmarkFilters } from "@/lib/supabase/queries/bookmarks"
import { PAGE_SIZE } from "@/lib/supabase/queries/bookmarks.constants"

import { BookAlert } from "lucide-react"

interface BookmarksLayoutProps {
    continueReading?: Bookmark[]
    recentlyAdded?: Bookmark[]
    bookmarks: Bookmark[]
    totalCount: number
    collections?: Collection[]
    showSavePrompt?: boolean
    stats?: { total_chapters: number } | null
    statusCounts?: Record<string, number>
    loading?: boolean
    isPending?: boolean
    filters: Pick<BookmarkFilters, "q" | "status" | "collectionId" | "sort">
    page: number
    onFilterChange: (updates: Record<string, string>) => void
    onPageChange: (page: number) => void
}

export const BookmarksLayout = ({
    continueReading,
    recentlyAdded,
    bookmarks,
    totalCount,
    collections,
    showSavePrompt = false,
    stats,
    statusCounts,
    loading = false,
    isPending = false,
    filters,
    page,
    onFilterChange,
    onPageChange,
}: BookmarksLayoutProps) => {
    const isFiltered = !!(
        filters.q ||
        (filters.status && filters.status !== "all") ||
        filters.collectionId
    )
    const totalPages = Math.ceil(totalCount / PAGE_SIZE)

    return (
        <div className="grid grid-cols-[1fr_17.5rem] gap-8 p-4">
            <div className="flex min-w-0 grow flex-col gap-5">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-1">
                        <h1 className="text-2xl font-bold">Закладки</h1>
                        <span className="rounded bg-[#17151a] px-1 py-px text-rose-500/80">
                            {totalCount}
                        </span>
                    </div>
                </div>

                {loading && <BookmarksSkeleton rowBookmarks={false} />}

                {continueReading && continueReading.length > 0 && (
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
                    <div className="mb-4 flex items-center justify-between gap-2">
                        <h2 className="text-xl">Все закладки</h2>
                        <BookmarksFilters
                            currentQ={filters.q ?? ""}
                            currentSort={filters.sort ?? "created_at:desc"}
                            isPending={isPending}
                            onFilterChange={onFilterChange}
                        />
                    </div>
                    {bookmarks.length > 0 ? (
                        <>
                            <List
                                className="mt-4 mb-6 grid grid-cols-1 gap-2 md:grid-cols-2 2xl:grid-cols-3"
                                items={bookmarks}
                                renderItem={(bookmark) => (
                                    <BookmarkRow bookmark={bookmark} />
                                )}
                            />
                            {totalPages > 1 && (
                                <Pagination
                                    totalPages={totalPages}
                                    isLoading={isPending}
                                    page={page}
                                    onPageChange={onPageChange}
                                />
                            )}
                        </>
                    ) : (
                        <p className="mt-2 text-sm text-gray-500">
                            {isFiltered
                                ? "Ничего не найдено. Попробуйте изменить фильтры."
                                : "Нет закладок. Добавьте мангу в закладки."}
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
                            total_manga_completed: statusCounts?.completed ?? 0,
                            total_chapters: stats.total_chapters ?? 0,
                            total_manga_reading: statusCounts?.reading ?? 0,
                        }}
                    />
                )}
                <CollectionsSection
                    isAuth={!showSavePrompt}
                    collections={collections}
                    statusCounts={statusCounts}
                    activeStatus={filters.status ?? "all"}
                    activeCollectionId={filters.collectionId ?? ""}
                    onFilterChange={onFilterChange}
                />
                {recentlyAdded && recentlyAdded.length > 0 && (
                    <RecentlySection bookmarks={recentlyAdded} />
                )}
            </div>
        </div>
    )
}
