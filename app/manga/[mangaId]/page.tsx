import { getCoverUrl } from "@/lib/MangaDex/getCoverUrl"
import { getMangaById } from "@/lib/MangaDex/getMangaById"
import { getMangaStatistics } from "@/lib/MangaDex/getMangaStatistics"
import { getArtist, getAuthor, getTags } from "@/lib/MangaDex/helpers"

import { searchMangaByName } from "@/lib/Remanga/searchMangaByName"
import { getMangaByName } from "@/lib/Remanga/getMangabyName"

import { InfoItemList } from "@/components/InfoItemList/InfoItemList"

import { getTitleFromAlt } from "@/utils/getTitleFromAlt"
import { getTitle } from "@/utils/getTitle"
import { removeLinks } from "@/utils/removeLinks"

import { langToFlag } from "@/maps/langToFlag"

import Link from "next/link"
import Image from "next/image"
import { Star } from "lucide-react"

export const MangaPageInfo = async ({
    params,
}: {
    params: Promise<{ mangaId: string }>
}) => {
    const { mangaId } = await params
    const manga = await getMangaById(mangaId)
    const coverUrl = getCoverUrl(manga)
    const title = getTitleFromAlt(manga.attributes.altTitles, "ru")
    const mangaTitle = await searchMangaByName(title!)
    const mangaRu = await getMangaByName(mangaTitle[0].dir)
    const statistic = await getMangaStatistics(mangaId)

    return (
        <div className="px-6 py-8">
            <div className="3xl:grid-cols-[33%_1fr] grid grid-cols-1 gap-6 md:grid-cols-[240px_1fr] xl:grid-cols-[24%_1fr] xl:gap-10 2xl:gap-14">
                <div className="flex flex-col items-center md:items-start">
                    <div className="relative aspect-2/3 w-full">
                        <Image
                            src={coverUrl!}
                            alt="cover"
                            fill
                            className="rounded-lg object-cover shadow-lg"
                            sizes="
                        (max-width: 768px) 50vw,
                        (max-width: 1280px) 240px,
                        (max-width: 1536px) 300px,
                        340px
                    "
                        />
                    </div>

                    <div className="3xl:text-[1.8rem] mt-4 flex w-full flex-row flex-wrap justify-between gap-2 text-xl">
                        <Link
                            href="chapter/"
                            className="grow rounded bg-rose-800 px-4 py-2 text-center shadow-md shadow-rose-900/50 transition hover:bg-rose-700 hover:shadow-lg hover:shadow-rose-900/70"
                        >
                            Read Chapter 1
                        </Link>
                        <button className="grow cursor-pointer rounded bg-gray-700 px-4 py-2 shadow-md shadow-gray-900/50 transition hover:bg-gray-600 hover:shadow-lg hover:shadow-gray-900/70">
                            Add to bookmarks
                        </button>
                    </div>
                </div>

                <div className="min-w-0">
                    <h1 className="3xl:text-5xl text-2xl font-bold xl:text-3xl">
                        {getTitle(
                            manga.attributes.title,
                            manga.attributes.altTitles,
                        )}
                    </h1>
                    <div className="mt-2 flex items-center">
                        <Star className="fill-amber-400 stroke-0" />
                        <span className="block fill-amber-400 pl-1 font-semibold text-yellow-400 xl:text-lg">
                            {statistic.rating.average.toFixed(2)}
                        </span>
                    </div>

                    <div
                        className="3xl:text-3xl mt-4 text-sm leading-relaxed text-gray-300 xl:text-xl"
                        dangerouslySetInnerHTML={{
                            __html: removeLinks(
                                manga.attributes.description["ru"]
                                    ? `<p>${manga.attributes.description["ru"]}</p>`
                                    : mangaRu.description,
                            ),
                        }}
                    />

                    <h2 className="mt-6 mb-3 flex items-center gap-3 text-lg font-semibold uppercase xl:text-xl">
                        Info
                        <span className="bg-secondary h-0.5 flex-1" />
                    </h2>

                    <InfoItemList
                        data={[
                            { label: "Author:", value: getAuthor(manga) },
                            { label: "Artist:", value: getArtist(manga) },
                            {
                                label: "Status:",
                                value: manga.attributes.status,
                            },
                            { label: "Year:", value: manga.attributes.year },
                            {
                                label: "Demographic:",
                                value: manga.attributes.publicationDemographic,
                            },
                            {
                                label: "Tags:",
                                value: getTags(manga).join(", "),
                            },
                            {
                                label: "Languages:",
                                value: manga.attributes.availableTranslatedLanguages.map(
                                    (lang) => (
                                        <span key={lang} title={lang}>
                                            {langToFlag[lang]}
                                        </span>
                                    ),
                                ),
                            },
                        ]}
                    />
                </div>
            </div>
        </div>
    )
}

export default MangaPageInfo
