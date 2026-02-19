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
    const mangaById = await getMangaById("cf923481-1e96-4959-b3c1-9518718a4cc2")
    console.log(mangaById)
    const mangalist = await getMangaList()
    const mangaListRender = () => {
        return mangalist.data.map(async (manga: any) => {
            const coverUrl = getCoverUrl(manga, 512)
            console.log(manga)
            return (
                <li key={manga.id}>
                    <a
                        href="#"
                        className="flex gap-3 p-2 rounded-lg hover:bg-white/10 transition-colors"
                    >
                        <div className="relative w-50 h-75">
                            <Image
                                src={coverUrl!}
                                alt="manga cover"
                                sizes="200px"
                                fill
                                className="rounded object-cover shrink-0"
                            />
                        </div>
                        <div className="flex flex-col flex-1 min-w-0">
                            <h3 className="font-semibold truncate">
                                {getTitle(
                                    manga.attributes.title,
                                    manga.attributes.altTitles,
                                )}
                            </h3>
                            <p className=" text-gray-400">Ch. {}</p>
                        </div>
                        <p className=" text-yellow-400 font-medium shrink-0">
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
                <h2 className="text-4xl font-bold mb-3">Popular Now</h2>
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
