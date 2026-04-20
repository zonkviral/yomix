import { List } from "@/components/ui/List/List"

import { formatRelativeDate } from "@/utils/formatRelativeDate"

import { Bookmark } from "@/lib/supabase/type"

import noCover from "@/assets/no_cover.webp"

import Image from "next/image"
import Link from "next/link"

interface RecentlySectionProps {
    bookmarks: Bookmark[]
}

export const RecentlySection = ({ bookmarks }: RecentlySectionProps) => (
    <section className="bg-neutral-900 p-4 shadow-md">
        <h2 className="text-xl font-bold text-neutral-100">
            Недавние закладки
        </h2>
        <List
            className="mt-4 flex flex-col gap-2"
            items={bookmarks}
            renderItem={(bookmark) => {
                const totalChapters = bookmark.manga[0].total_chapters
                return (
                    <Link
                        href={`/manga/${bookmark.manga[0].id}`}
                        className="flex gap-4 rounded p-1 hover:bg-neutral-800"
                    >
                        <div className="relative h-24 w-16 shrink-0">
                            <Image
                                loading="lazy"
                                src={bookmark.manga[0].cover_url || noCover}
                                alt="manga cover"
                                fill
                                sizes="80px"
                                className="rounded object-cover"
                            />
                        </div>
                        <div className="flex min-w-0 flex-1 flex-col justify-between gap-1 text-gray-500">
                            <div className="flex flex-col">
                                <h3 className="line-clamp-2 text-lg leading-5 text-white">
                                    {bookmark.manga[0].title}
                                </h3>
                                {totalChapters && (
                                    <span className="mt-1 text-sm font-semibold">
                                        Глава {totalChapters}
                                    </span>
                                )}
                            </div>
                            <span className="mb-0.5 text-sm text-gray-500">
                                {formatRelativeDate(
                                    new Date(bookmark.updated_at),
                                )}
                            </span>
                        </div>
                    </Link>
                )
            }}
        />
    </section>
)
