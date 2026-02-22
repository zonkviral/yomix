import { getMangaList } from "@/lib/MangaDex/getMangaList"

import { MangaCard } from "../MangaCard/MangaCard"
import { List } from "../List/List"

export const Discover = async () => {
    const mangalist = await getMangaList()

    return (
        <section className="mt-8.75">
            <h2 className="mb-6 text-4xl font-bold">Discover Manga</h2>
            <List
                list={mangalist}
                className="grid list-none grid-cols-1 gap-4 2xl:grid-cols-2"
                listClassName="relative select-text"
                keyExtractor={(manga) => manga.id}
                renderItem={(manga) => <MangaCard manga={manga} />}
            />
        </section>
    )
}
