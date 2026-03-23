import { getPopularManga } from "@/lib/MangaDex/getPopularManga"
import { Manga } from "@/lib/MangaDex/types"

import { CarouselWrapper } from "@/components/CarouselWrapper/CarouselWrapper"
import { CarouselCard } from "@/components/CarouselCard/CarouselCard"

import { List } from "@/components/List/List"

export const PopularList = async () => {
    const data = await getPopularManga()
    return (
        <section className="overflow-hidden">
            <h2 className="mb-3 text-4xl font-bold">Популярное</h2>
            <CarouselWrapper>
                <List
                    keyExtractor={(data: Manga) => data.id}
                    className="flex list-none flex-row"
                    listClassName="p-2 first:pl-0"
                    list={data}
                    renderItem={(manga: Manga) => (
                        <CarouselCard manga={manga} />
                    )}
                />
            </CarouselWrapper>
        </section>
    )
}
