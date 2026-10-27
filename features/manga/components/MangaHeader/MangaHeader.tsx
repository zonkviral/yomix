"use client"
import Image from "next/image"
import Link from "next/link"

import { cn } from "@/utils/cn"

import { BookmarkButton } from "@/features/bookmarks/components/BookmarkButton/BookmarkButton"

import { List } from "@/components/ui/List/List"
import { FlagIcon } from "@/components/ui/FlagIcon/FlagIcon"

import { Manga, MangaInfo } from "@/lib/supabase/type"
import { tagTranslationMap } from "@/lib/MangaDex/mappings/tagTranslationMap"

import { Languages, BookOpenText, Calendar1, Clock3, Play, Share2, Star, User } from "lucide-react"

interface MangaHeaderProps {
    info: MangaInfo
    coverUrl: string
    title: string
    rating?: number
    id: string
    altTitle: string
    manga: Manga
}

export const MangaHeader = ({
    info,
    coverUrl,
    title,
    altTitle,
    rating,
    id,
    manga,
}: MangaHeaderProps) => {
    const mangaMetadata = [
        { icon: User, value: info.author },
        { icon: Clock3, value: info.status },
        { icon: BookOpenText, value: "Chapter 321" },
        { icon: Calendar1, value: info.year },
    ]

    return (
        <div className="flex flex-col items-stretch gap-10 md:flex-row md:items-start">
            <div className="relative aspect-2/3 max-w-100 rounded-lg shadow-lg md:min-w-60 xl:max-w-75">
                <Image
                    src={coverUrl ?? ""}
                    alt={`Обложка манги ${altTitle}`}
                    fill
                    priority
                    className="rounded-lg object-cover shadow-lg"
                    sizes="
                        (max-width: 768px) 50vw,
                        (max-width: 1280px) 240px,
                        (max-width: 1536px) 300px,
                        340px
                    "
                />
            </div>
            <div className="my-auto flex flex-col justify-evenly gap-2">
                <div>
                    <h1 className="3xl:text-5xl font-bold xl:text-3xl">{altTitle}</h1>
                    <span className="text-xs text-gray-400">{title}</span>
                </div>
                {rating && (
                    <div className="mt-2 flex items-center">
                        <Star className="w-6 fill-amber-400 text-amber-400" />
                        <span className="block fill-amber-400 pl-1 font-semibold text-yellow-400 xl:text-xl">
                            {rating.toFixed(2)}
                        </span>
                    </div>
                )}
                <List
                    items={mangaMetadata}
                    className="mt-2 flex flex-col items-stretch divide-y divide-zinc-800/80 text-sm text-zinc-400 md:flex-row md:items-center md:divide-x md:divide-y-0"
                    listClassName="flex md:items-center md:px-4 first:pl-0"
                    renderItem={({ icon: Icon, value }) => (
                        <>
                            <Icon className="h-4 w-4" />
                            <span className="pl-2">{value}</span>
                        </>
                    )}
                />
                <div className="mt-2 flex items-center gap-2 text-zinc-400">
                    <Languages className="w-4 shrink-0 self-start" />
                    <List
                        className="flex flex-wrap gap-2"
                        items={info.languages}
                        renderItem={(lang) => <FlagIcon lang={lang} />}
                    />
                </div>
                <List
                    className="mt-4 flex flex-wrap gap-2"
                    listClassName="flex flex-wrap gap-2"
                    items={info.tags}
                    renderItem={(tag) => (
                        <span className="rounded-2xl border-rose-900/40 bg-rose-700/20 px-3 py-2 text-sm font-semibold text-red-100 md:text-base">
                            {tagTranslationMap[tag] || tag}
                        </span>
                    )}
                />
                <div className="mt-4 flex gap-2 text-xl">
                    <Link
                        href={`/manga/${id}/chapter/1`}
                        className={cn(
                            "flex flex-wrap items-center gap-3 rounded-xl",
                            "bg-rose-900 px-4 py-2 text-center shadow-md shadow-rose-900/50 transition hover:bg-rose-800 hover:shadow-lg hover:shadow-rose-900/70",
                        )}
                    >
                        <Play className="w-5 fill-amber-50" />
                        {false ? (
                            <span className="flex-1 text-wrap">"Читать c начала"</span>
                        ) : (
                            <div className="flex flex-col items-start">
                                <span>Продолжить</span>
                                <span className="text-sm text-amber-50/80">Глава 212</span>
                            </div>
                        )}
                    </Link>
                    <BookmarkButton mangaId={id} manga={manga} />
                    <button
                        aria-label="Поделиться"
                        className={cn(
                            "rounded-xl bg-neutral-900 px-4.5 py-2 shadow-md shadow-neutral-900/50 transition",
                            "hover:bg-neutral-800 hover:text-neutral-300/80 hover:shadow-lg hover:shadow-neutral-900/70",
                        )}
                    >
                        <Share2 className="w-4" />
                    </button>
                </div>
            </div>
        </div>
    )
}
