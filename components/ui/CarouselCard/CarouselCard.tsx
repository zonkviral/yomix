import { contentRating as contentRatingMap } from "@/lib/MangaDex/constants"
import Image, { StaticImageData } from "next/image"
import Link from "next/link"

type ContentRatingKey = keyof typeof contentRatingMap

interface CarouselCardProps {
    href: string
    coverUrl?: string | StaticImageData
    title: string
    contentRating?: ContentRatingKey
}

export const CarouselCard = ({
    href,
    coverUrl,
    title,
    contentRating,
}: CarouselCardProps) => (
    <Link href={href}>
        <div className="group/card relative isolate h-48 w-32 overflow-hidden rounded-xl shadow-lg shadow-black/50 transition-all duration-200 hover:scale-105 hover:shadow-xl hover:shadow-black/70 sm:h-60 sm:w-40 md:h-72 md:w-48 lg:h-75 lg:w-50">
            <Image
                className="object-cover"
                src={coverUrl ?? ""}
                alt="cover"
                sizes="224px"
                loading="lazy"
                fill
            />
            {contentRating && (
                <span
                    className={`absolute top-1.5 left-0 rounded-r-lg p-1 text-sm font-bold text-neutral-800 opacity-0 transition-opacity group-hover/card:opacity-100 ${contentRatingMap[contentRating][1]}`}
                >
                    {contentRatingMap[contentRating][0]}
                </span>
            )}
            <h3 className="absolute bottom-0 left-0 line-clamp-3 w-full bg-linear-to-t from-black/60 to-[#0000007d] px-2 py-1 text-[1.1rem] font-semibold opacity-0 transition-opacity text-shadow-[1px_1px_black] group-hover/card:opacity-100">
                {title}
            </h3>
        </div>
    </Link>
)
