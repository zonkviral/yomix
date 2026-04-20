import { CarouselWrapper } from "@/components/CarouselWrapper/CarouselWrapper"
import { CarouselCard } from "@/components/CarouselCard/CarouselCard"
import { List } from "@/components/List/List"

import { getPopularManga } from "@/lib/MangaDex/getPopularManga"
import { getCoverUrl } from "@/lib/MangaDex/getCoverUrl"
import { Manga } from "@/lib/MangaDex/types"

import { getTitleFromAlt } from "@/utils/getTitleFromAlt"

export const PopularList = async () => {
    const data = await getPopularManga()
    return (
        <section className="overflow-hidden">
            <h2 className="mb-3 text-4xl font-bold">Популярное</h2>
            <CarouselWrapper isNavButtons={true}>
                {data.length > 0 ? (
                    <List
                        keyExtractor={(data: Manga) => data.id}
                        className="flex list-none flex-row"
                        listClassName="p-2 first:pl-0"
                        items={data}
                        renderItem={(manga: Manga) => (
                            <CarouselCard
                                href={`/manga/${manga.id}`}
                                coverUrl={getCoverUrl(manga, 256) ?? undefined}
                                title={
                                    getTitleFromAlt(
                                        manga.attributes.altTitles,
                                        "ru",
                                    )[0] ??
                                    getTitleFromAlt(
                                        manga.attributes.altTitles,
                                        "en",
                                    )[0] ??
                                    getTitleFromAlt(
                                        manga.attributes.altTitles,
                                        "en",
                                    )[0] ??
                                    manga.attributes.title ??
                                    "Без названия"
                                }
                                contentRating={manga.attributes.contentRating}
                            />
                        )}
                    />
                ) : (
                    <p className="text-sm text-gray-500">
                        Нет данных для отображения.
                    </p>
                )}
            </CarouselWrapper>
        </section>
    )
}
