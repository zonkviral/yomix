"use client"

import { useEffect, useRef, useState } from "react"

import { ProgressBar } from "@/components/feedback/ProgressBar/ProgressBar"

import { Bookmark } from "@/lib/supabase/type"

import {
    getExternalId,
    getLastChapter,
    getLastChapterId,
    getLastPage,
    getTotalChapters,
} from "../../utils/helpers"

import { EllipsisVertical } from "lucide-react"

import noCover from "@/assets/no_cover.webp"

import Image from "next/image"
import Link from "next/link"
import { BookmarkActionsMenu } from "../BookmarkActionsMenu/BookmarkActionsMenu"

interface BookmarkCardProps {
    bookmark: Bookmark
}

export const BookmarkCard = ({ bookmark }: BookmarkCardProps) => {
    const lastReadChapterId = getLastChapterId(bookmark)
    const lastReadChapter = getLastChapter(bookmark)
    const externalId = getExternalId(bookmark)
    const totalChapters = getTotalChapters(bookmark)
    const lastReadPage = getLastPage(bookmark)

    const menuRef = useRef<HTMLDivElement>(null)
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(e.target as Node)
            ) {
                setIsOpen(false)
            }
        }
        if (isOpen) document.addEventListener("mousedown", handleClickOutside)
        return () =>
            document.removeEventListener("mousedown", handleClickOutside)
    }, [isOpen])

    return (
        <div
            className="group/actionMenu relative flex h-full w-min flex-col justify-between rounded bg-neutral-900/50"
            ref={menuRef}
        >
            <div className="relative isolate flex aspect-2/3 w-50 shrink-0 flex-col rounded">
                <Image
                    src={bookmark.manga.cover_url || noCover}
                    alt={bookmark.manga.title}
                    fill
                    className="rounded object-cover"
                />
                <button
                    onClick={(e) => {
                        e.preventDefault()
                        setIsOpen(!isOpen)
                    }}
                    className="absolute top-0.5 right-0.5 z-120 rounded bg-neutral-800 p-1 opacity-0 transition-opacity group-hover/actionMenu:opacity-100 hover:bg-neutral-900"
                >
                    <EllipsisVertical className="w-4 text-white" />
                </button>
                {isOpen && (
                    <BookmarkActionsMenu
                        bookmark={bookmark}
                        setIsOpen={setIsOpen}
                    />
                )}
                {totalChapters && totalChapters > 0 && (
                    <span className="absolute bottom-0 left-1/2 mb-2 w-max -translate-x-1/2 rounded-full bg-neutral-800/90 px-2 py-1 text-sm font-bold text-neutral-300">
                        Глава {totalChapters}
                    </span>
                )}
            </div>
            <div className="flex h-full flex-col justify-between p-1.5">
                <div>
                    <h3 className="text-lg leading-5.5 font-semibold text-wrap">
                        {bookmark.manga.title}
                    </h3>
                    <h4 className="mt-1 text-sm font-semibold text-gray-500">
                        {bookmark.manga.author}
                    </h4>
                </div>
                <Link
                    href={`/manga/${externalId}/chapter/${lastReadChapterId ?? 1}?page=${lastReadPage !== undefined ? lastReadPage : 1}`}
                    className="mt-2 block rounded p-1 hover:bg-neutral-800"
                >
                    <ProgressBar
                        current={lastReadChapter ?? 0}
                        total={totalChapters || 0}
                    />
                </Link>
            </div>
        </div>
    )
}
