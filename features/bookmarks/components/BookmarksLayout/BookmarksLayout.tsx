import { BookmarkCard } from "@/features/bookmarks/components/BookmarkCard/BookmarkCard"
import { BookmarkRow } from "@/features/bookmarks/components/BookmarkRow/BookmarkRow"

import { CarouselWrapper } from "@/components/CarouselWrapper/CarouselWrapper"
import { List } from "@/components/List/List"

import { Bookmark } from "@/lib/supabase/type"

interface BookmarksLayoutProps {
    bookmarks: Bookmark[]
    sidebar: React.ReactNode
}

export const BookmarksLayout = ({
    bookmarks,
    sidebar,
}: BookmarksLayoutProps) => {
    const continueReading = [...bookmarks]
        .filter((b) => b.reading_progress.length > 0)
        .sort(
            (a, b) =>
                new Date(b.updated_at).getTime() -
                new Date(a.updated_at).getTime(),
        )
        .slice(0, 10)

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
                    <p className="text-sm text-gray-500">
                        Здесь отображаются все ваши закладки.
                    </p>
                </div>

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
                </section>
            </div>

            <div className="ml-auto flex w-70 flex-col gap-4">{sidebar}</div>
        </div>
    )
}
