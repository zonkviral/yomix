/* eslint-disable @typescript-eslint/no-explicit-any */
import { PopularList } from "@/components/PopularList/PopularList"
import { getCoverUrl } from "@/lib/MangaDex/getCoverUrl"
import { getMangaById } from "@/lib/MangaDex/getMangaById"
import { getMangaList } from "@/lib/MangaDex/getMangaList"
import Image from "next/image"

const HomePage = async () => {
    const getTitleFromAlt = (
        altTitles: Record<string, string>[],
        lang: string,
    ): string | undefined => {
        return altTitles.find((t) => t[lang])?.[lang]
    }

    const getTitle = (
        title: Record<string, string>,
        altTitles: Record<string, string>[],
    ): string => {
        return (
            getTitleFromAlt(altTitles, "ru") ??
            title["ru"] ??
            getTitleFromAlt(altTitles, "en") ??
            title["en"] ??
            getTitleFromAlt(altTitles, "ja-ro") ??
            title["ja-ro"] ??
            Object.values(altTitles[0] ?? {})[0] ??
            Object.values(title)[0] ??
            "No title"
        )
    }
    const mangalist = await getMangaList()
    const mangaListRender = () => {
        return mangalist.data.map(async (manga: any) => {
            const coverUrl = getCoverUrl(manga, 512)
            return (
                <li key={manga.id}>
                    <a
                        href="#"
                        className="flex gap-3 rounded-lg p-2 transition-colors hover:bg-white/10"
                    >
                        <div className="relative h-75 w-50">
                            <Image
                                src={coverUrl!}
                                alt="manga cover"
                                sizes="200px"
                                fill
                                className="shrink-0 rounded object-cover"
                            />
                        </div>
                        <div className="flex min-w-0 flex-1 flex-col">
                            <h3 className="truncate font-semibold">
                                {getTitle(
                                    manga.attributes.title,
                                    manga.attributes.altTitles,
                                )}
                            </h3>
                            <p className="text-gray-400">Ch. {}</p>
                        </div>
                        <p className="shrink-0 font-medium text-yellow-400">
                            rating
                        </p>
                    </a>
                </li>
            )
        })
    }

    return (
        <>
            <section className="overflow-hidden">
                <h2 className="mb-3 text-4xl font-bold">Popular Now</h2>
                <PopularList />
            </section>
            <section className="mt-8.75 w-max">
                <h2 className="text-4xl font-bold">Discover Manga</h2>
                <ul className="list-none pl-4">{mangaListRender()}</ul>
            </section>
        </>
    )
}

export default HomePage
