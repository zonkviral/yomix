import { contentRating } from "@/lib/MangaDex/constants"
import { getCoverUrl } from "@/lib/MangaDex/getCoverUrl"
import { Manga } from "@/lib/MangaDex/types"

import { getTitleFromAlt } from "@/utils/getTitleFromAlt"

import Image from "next/image"
import Link from "next/link"

export const CarouselCard = ({ manga }: { manga: Manga }) => {
    const coverUrl = getCoverUrl(manga, 256)
    const title = getTitleFromAlt(manga.attributes.altTitles, "ru")

    return (
        <Link href={`manga/${manga.id}`}>
            <div className="group/card relative isolate h-48 w-32 overflow-hidden rounded-xl shadow-lg shadow-black/50 transition-all duration-200 hover:scale-105 hover:shadow-xl hover:shadow-black/70 sm:h-60 sm:w-40 md:h-72 md:w-48 lg:h-75 lg:w-50">
                <Image
                    className="object-cover"
                    src={coverUrl ?? ""}
                    alt="cover"
                    sizes="224px"
                    loading="lazy"
                    fill
                />
                <span
                    className={`absolute top-1.5 left-0 rounded-r-lg p-1 text-sm font-bold text-neutral-800 opacity-0 transition-opacity group-hover/card:opacity-100 ${contentRating[manga.attributes.contentRating][1]}`}
                >
                    {contentRating[manga.attributes.contentRating][0]}
                </span>
                <h3 className="absolute bottom-0 left-0 line-clamp-3 w-full bg-linear-to-t from-black/60 to-[#0000007d] px-2 py-1 text-[1.1rem] font-semibold opacity-0 transition-opacity text-shadow-[1px_1px_black] group-hover/card:opacity-100">
                    {title}
                </h3>
            </div>
        </Link>
    )
}
