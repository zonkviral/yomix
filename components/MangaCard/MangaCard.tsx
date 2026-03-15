import { EnrichedManga } from "@/actions/getMangaList.action"
import { NoDragLink } from "@/components/NoDragLink/NoDragLink"
import { formatNumber } from "@/utils/formatNumber"
import { tagTranslationMap } from "@/utils/tagTranslationMap"
import { statusTranslationMap } from "@/utils/statusTranslationMap"
import { Star, Users } from "lucide-react"
import Image from "next/image"

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

export const MangaCard = ({
    manga,
    coverUrl,
    titleDisplay,
    description,
    rating,
    follows,
}: EnrichedManga) => {
    return (
        <NoDragLink
            href={`manga/${manga.id}`}
            className="flex gap-3 rounded-lg p-2 transition-colors hover:bg-white/10"
        >
            <div className="relative h-75 w-50">
                {coverUrl && (
                    <Image
                        loading="lazy"
                        src={coverUrl}
                        alt="manga cover"
                        sizes="200px"
                        fill
                        className="shrink-0 rounded object-cover"
                    />
                )}
            </div>
            <div className="flex min-w-0 flex-1 flex-col">
                <h3 className="truncate text-xl font-bold">{titleDisplay}</h3>
                {/* <span className="mt-3 text-gray-400">
                    Ch. {manga.attributes.lastChapter}
                </span> */}
                <ul className="mt-3 flex list-none flex-wrap gap-1">
                    {manga.attributes.tags.map((tag, id) => (
                        <li
                            className="bg-secondary rounded-sm px-4 capitalize"
                            key={id}
                        >
                            {tag.attributes.name["ru"] ??
                                tagTranslationMap[tag.attributes.name["en"]] ??
                                tag.attributes.name["en"]}
                        </li>
                    ))}
                </ul>
                <span
                    className={`mt-2 w-fit rounded-sm ${status[manga.attributes.status]} px-4 py-0.5 capitalize`}
                >
                    {statusTranslationMap[manga.attributes.status]}
                </span>
                <span
                    className={`absolute left-2 w-fit rounded-sm px-4 text-black text-shadow-[0px_0px_0px_black] ${contentRating[manga.attributes.contentRating][1]}`}
                >
                    {contentRating[manga.attributes.contentRating][0]}
                </span>
                <div className="mt-4 flex capitalize">
                    <Users width={20} />
                    <span className="pl-1">
                        {formatNumber(follows)} Followers
                    </span>
                </div>
                {description && (
                    <p className="mb-3 line-clamp-2 grow content-end">
                        {description}
                    </p>
                )}
            </div>
            <span className="flex shrink-0 font-medium text-yellow-400">
                <Star className="fill-amber-400 stroke-0 pr-1" />
                {rating.toFixed(2)}
            </span>
        </NoDragLink>
    )
}
