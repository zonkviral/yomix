import { SearchResult } from "@/actions/getSearchResult.action"

import { statusTranslationMap } from "@/lib/MangaDex/mappings/statusTranslationMap"
import { contentRating, status } from "@/lib/MangaDex/constants"

import { Highlight } from "@/components/Highlight/Highlight"

import Image from "next/image"

interface SearchCardProps {
    result: SearchResult
    query: string
}

export const SearchCard = ({ result, query }: SearchCardProps) => {
    const { manga, coverUrl, titleDisplay } = result
    return (
        <a
            href={`/manga/${manga.id}`}
            className="relative flex gap-3 rounded-lg px-3 py-1 transition-colors hover:bg-white/5"
        >
            <div className="relative h-24 w-16 shrink-0">
                {coverUrl ? (
                    <Image
                        loading="lazy"
                        src={coverUrl}
                        alt="manga cover"
                        fill
                        sizes="80px"
                        className="rounded object-cover"
                    />
                ) : (
                    <div className="h-full w-full rounded bg-neutral-800" />
                )}
            </div>
            <div className="flex min-w-0 flex-1 flex-col justify-between gap-1">
                <h4 className="line-clamp-2 text-base/tight text-amber-50/70">
                    <Highlight text={titleDisplay} query={query} />
                </h4>
                <div className="flex flex-col gap-2">
                    <span
                        className={`w-fit rounded p-1 text-xs capitalize opacity-90 ${status[manga.attributes.status]}`}
                    >
                        {statusTranslationMap[manga.attributes.status]}
                    </span>
                    <span
                        className={`${contentRating[manga.attributes.contentRating][1]} w-fit rounded px-1 py-px text-xs opacity-90`}
                    >
                        {contentRating[manga.attributes.contentRating][0]}
                    </span>
                </div>
            </div>
        </a>
    )
}
