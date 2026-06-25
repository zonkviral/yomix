"use client"
import { memo } from "react"

import { BookmarkActionsMenu } from "../BookmarkActionsMenu/BookmarkActionsMenu"

import { ProgressBar } from "@/components/feedback/ProgressBar/ProgressBar"

import { Bookmark } from "@/lib/supabase/type"

import {
    getExternalId,
    getLastChapter,
    getLastChapterId,
    getLastPage,
    getTotalChapters,
} from "../../utils/helpers"

import Image from "next/image"
import Link from "next/link"

import noCover from "@/assets/no_cover.webp"

interface BookmarkRowProps {
    bookmark: Bookmark
    openModal: (b: Bookmark) => void
    priority?: boolean
}

export const BookmarkRow = memo(
    ({ bookmark, openModal, priority }: BookmarkRowProps) => {
        const lastReadChapterId = getLastChapterId(bookmark)
        const lastReadChapter = getLastChapter(bookmark)
        const totalChapters = getTotalChapters(bookmark)
        const externalId = getExternalId(bookmark)
        const lastReadPage = getLastPage(bookmark)

        return (
            <div className="group/actionMenu relative flex gap-4 rounded p-1 hover:bg-neutral-900">
                <Link
                    href={`/manga/${externalId}`}
                    className="absolute inset-0 z-10"
                    aria-label={bookmark.manga.title}
                />
                <BookmarkActionsMenu
                    bookmark={bookmark}
                    openAddToCollectionModal={() => openModal(bookmark)}
                />
                <div className="relative isolate flex aspect-2/3 w-30 shrink-0 rounded">
                    <Image
                        src={bookmark.manga.cover_url || noCover}
                        alt={bookmark.manga.title}
                        loading="lazy"
                        fill
                        priority={priority}
                        sizes="256px"
                        className="rounded object-cover"
                    />
                </div>
                <div className="relative flex w-full flex-col justify-between gap-1">
                    <div>
                        <h3 className="pr-5 text-lg leading-5.5 font-semibold text-wrap">
                            {bookmark.manga.title}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                            {bookmark.manga.author}
                        </p>
                    </div>
                    {totalChapters && totalChapters > 0 ? (
                        <div>
                            <Link
                                href={`/manga/${externalId}/chapter/${lastReadChapterId ?? 1}?page=${lastReadPage !== undefined ? lastReadPage : 1}`}
                                className="relative z-20 mt-auto block rounded p-1 hover:bg-neutral-800"
                            >
                                <ProgressBar
                                    current={lastReadChapter ?? 0}
                                    total={totalChapters || 0}
                                />
                            </Link>
                        </div>
                    ) : null}
                </div>
            </div>
        )
    },
)
