import { getCoverUrl } from "@/lib/MangaDex/getCoverUrl"
import { getMangaList } from "@/lib/MangaDex/getMangaList"
import { getMangaStatistics } from "@/lib/MangaDex/getMangaStatistics"
import { formatNumber } from "@/utils/formatNumber"
import { getTitle } from "@/utils/getTitle"
import { removeLinks } from "@/utils/removeLinks"
import { Users } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const status = {
    ongoing: "bg-blue-500",
    completed: "bg-emerald-600",
    hiatus: "bg-amber-500",
    cancelled: "bg-red-600",
}
const contentRating = {
    safe: ["12+", "bg-green-500/70"],
    suggestive: ["16+", "bg-yellow-500/70"],
    erotica: ["18+", "bg-orange-500/70"],
    pornographic: ["18+", "bg-red-500/70"],
}

export const Discover = () => {
    const mangaListRender = async () => {
        const mangalist = await getMangaList()

        return mangalist.map(async (manga) => {
            const mangaStat = await getMangaStatistics(manga.id)

            const coverUrl = getCoverUrl(manga, 512)
            return (
                <li key={manga.id} className="relative">
                    <Link
                        href={`manga/${manga.id}`}
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
                            <h3 className="truncate text-xl font-bold whitespace-pre-wrap">
                                {getTitle(
                                    manga.attributes.title,
                                    manga.attributes.altTitles,
                                )}
                            </h3>
                            <span className="mt-3 text-gray-400">
                                Ch. {manga.attributes.lastChapter}
                            </span>
                            <ul className="mt-3 flex list-none flex-wrap gap-1">
                                {manga.attributes.tags.map((tag, id) => (
                                    <li
                                        className="bg-secondary rounded-sm px-4 capitalize"
                                        key={id}
                                    >
                                        {tag.attributes.name["en"]}
                                    </li>
                                ))}
                            </ul>
                            <span
                                className={`mt-2 w-fit rounded-sm ${status[manga.attributes.status]} px-4 py-0.5 capitalize`}
                            >
                                {manga.attributes.status}
                            </span>
                            <span
                                className={`absolute left-2 w-fit rounded-sm px-4 text-black text-shadow-[0px_0px_0px_black] ${contentRating[manga.attributes.contentRating][1]}`}
                            >
                                {
                                    contentRating[
                                        manga.attributes.contentRating
                                    ][0]
                                }
                            </span>
                            <div className="mt-4 flex capitalize">
                                <Users width={20} />
                                <span className="pl-1">
                                    {formatNumber(mangaStat.follows)} Followers
                                </span>
                            </div>
                            {manga.attributes.description && (
                                <p className="mb-3 line-clamp-3 grow content-end">
                                    {removeLinks(
                                        manga.attributes.description["ru"] ??
                                            manga.attributes.description["en"],
                                    )}
                                </p>
                            )}
                        </div>
                        <p className="shrink-0 font-medium text-yellow-400">
                            {mangaStat.rating.average.toFixed(2)}
                        </p>
                    </Link>
                </li>
            )
        })
    }
    return (
        <section className="mt-8.75">
            <h2 className="mb-6 text-4xl font-bold">Discover Manga</h2>
            <ul className="grid list-none grid-cols-1 gap-4 2xl:grid-cols-2">
                {mangaListRender()}
            </ul>
        </section>
    )
}
