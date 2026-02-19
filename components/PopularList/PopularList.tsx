import { getCoverUrl } from "@/lib/MangaDex/getCoverUrl"
import { getPopularManga } from "@/lib/MangaDex/getPopularManga"
import Image from "next/image"
import { CarouselWrapper } from "../CarouselWrapper/CarouselWrapper"

export const PopularList = async () => {
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
    const data = await getPopularManga()
    const popularListRender = () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return data.data.map((manga: any) => {
            const coverUrl = getCoverUrl(manga, 512)
            return (
                <li key={manga.id} className="p-2 first:pl-0">
                    <a href="/*">
                        <div className="relative isolate h-48 w-32 overflow-hidden rounded-xl shadow-lg shadow-black/50 transition-all duration-200 hover:scale-105 hover:shadow-xl hover:shadow-black/70 sm:h-60 sm:w-40 md:h-72 md:w-48 lg:h-75 lg:w-50">
                            <Image
                                className="object-cover"
                                src={coverUrl!}
                                alt="cover"
                                sizes="200px"
                                loading="eager"
                                fill
                            />
                            <h3 className="absolute bottom-0 left-0 line-clamp-3 w-full bg-linear-to-t from-black/60 to-[#0000007d] px-2 py-1 text-sm font-semibold">
                                {getTitle(
                                    manga.attributes.title,
                                    manga.attributes.altTitles,
                                )}
                            </h3>
                        </div>
                    </a>
                </li>
            )
        })
    }
    return (
        <CarouselWrapper>
            <ul className="flex list-none flex-row">{popularListRender()}</ul>
        </CarouselWrapper>
    )
}
