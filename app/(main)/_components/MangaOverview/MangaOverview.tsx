"use client"

import { BookmarkButton } from "@/features/bookmarks/components/BookmarkButton/BookmarkButton"

import { DetailsTable } from "@/components/DetailsTable/DetailsTable"

import { tagTranslationMap } from "@/lib/MangaDex/mappings/tagTranslationMap"
import { statusTranslationMap } from "@/lib/MangaDex/mappings/statusTranslationMap"
import { MangaInfo, MangaSource } from "@/lib/supabase/type"

import { Star } from "lucide-react"

import Link from "next/link"
import Image from "next/image"

interface MangaOverviewProps {
    id: string
    title: string
    coverUrl: string | null
    rating?: number
    description: string
    manga?: MangaSource
    info: MangaInfo
    isBookmarked?: boolean
}

export const MangaOverview = ({
    id,
    title,
    coverUrl,
    rating,
    description,
    manga,
    info,
    isBookmarked = false,
}: MangaOverviewProps) => {
    return (
        <div className="px-6 py-8">
            <div className="3xl:grid-cols-[33%_1fr] grid grid-cols-1 gap-6 md:grid-cols-[240px_1fr] xl:grid-cols-[24%_1fr] xl:gap-10 2xl:gap-14">
                <div className="flex flex-col items-center md:items-start">
                    <div className="relative aspect-2/3 w-full">
                        <Image
                            src={coverUrl ?? ""}
                            alt="cover"
                            fill
                            loading="lazy"
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
                            href={`/manga/${id}/chapter/1`}
                            className="grow rounded bg-rose-800 px-4 py-2 text-center shadow-md shadow-rose-900/50 transition hover:bg-rose-700 hover:shadow-lg hover:shadow-rose-900/70"
                        >
                            Читать c начала
                        </Link>
                        <BookmarkButton
                            mangaId={id}
                            isBookmarked={isBookmarked}
                            manga={manga}
                        />
                    </div>
                </div>

                <div className="min-w-0">
                    <h1 className="3xl:text-5xl text-2xl font-bold xl:text-3xl">
                        {title}
                    </h1>

                    {rating && (
                        <div className="mt-2 flex items-center">
                            <Star className="fill-amber-400 stroke-0" />
                            <span className="block fill-amber-400 pl-1 font-semibold text-yellow-400 xl:text-lg">
                                {rating.toFixed(2)}
                            </span>
                        </div>
                    )}

                    <div className="3xl:text-3xl mt-4 text-sm leading-relaxed text-gray-300 xl:text-xl">
                        <p>{description}</p>
                    </div>

                    <h2 className="mt-6 mb-3 flex items-center gap-3 text-lg font-semibold uppercase xl:text-xl">
                        Информация
                        <span className="bg-secondary h-0.5 flex-1" />
                    </h2>
                    <DetailsTable
                        data={[
                            { label: "Автор:", value: info.author },
                            { label: "Художник:", value: info.artist },
                            {
                                label: "Статус:",
                                value: statusTranslationMap[info.status],
                            },
                            { label: "Год:", value: info.year },
                            {
                                label: "Теги:",
                                value: info.tags
                                    .map((tag) => tagTranslationMap[tag] || tag)
                                    .join(", "),
                            },
                            {
                                label: "языки:",
                                value: info.languages.map((lang, index) => (
                                    <div
                                        key={index}
                                        className="relative h-4.5 w-6"
                                    >
                                        <Image
                                            src={lang}
                                            alt="lang"
                                            fill
                                            sizes="24"
                                        />
                                    </div>
                                )),
                            },
                        ]}
                    />
                </div>
            </div>
        </div>
    )
}
