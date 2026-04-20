import { MangaCard } from "@/components/MangaCard/MangaCard"
import { List } from "@/components/List/List"

import { getNewestManga } from "@/lib/MangaDex/getNewestManga"

import { fetchEnrichedManga } from "@/utils/enrichManga"

export const NewestList = async () => {
    const { items } = await fetchEnrichedManga(getNewestManga)

    return (
        <section className="mt-8.75">
            <h2 className="mb-3 text-4xl font-bold">Новинки</h2>
            {items.length > 0 ? (
                <List
                    items={items}
                    className="grid list-none grid-cols-1 gap-4 2xl:grid-cols-2"
                    listClassName="relative select-text"
                    keyExtractor={(item) => item.manga.id}
                    renderItem={(item) => <MangaCard {...item} />}
                />
            ) : (
                <p className="text-sm text-gray-500">
                    Нет данных для отображения.
                </p>
            )}
        </section>
    )
}
