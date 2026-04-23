"use client"
import { useEffect, useRef, useState } from "react"

import { BookmarkActionsMenu } from "../BookmarkActionsMenu/BookmarkActionsMenu"

import { ProgressBar } from "@/components/feedback/ProgressBar/ProgressBar"

import { Bookmark } from "@/lib/supabase/type"

import { getLastChapter } from "../../utils/helpers"

import { EllipsisVertical } from "lucide-react"

import noCover from "@/assets/no_cover.webp"

import Image from "next/image"
import Link from "next/link"

interface BookmarkRowProps {
    bookmark: Bookmark
}

export const BookmarkRow = ({ bookmark }: BookmarkRowProps) => {
    const menuRef = useRef<HTMLDivElement>(null)
    const [isOpen, setIsOpen] = useState(false)
    const lastReadChapter = getLastChapter(bookmark)
    const totalChapters = bookmark.manga[0].total_chapters

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
            className="relative flex gap-4 rounded p-1 hover:bg-neutral-900"
            ref={menuRef}
        >
            <Link
                href={`/manga/${bookmark.manga[0].id}`}
                className="absolute inset-0 z-10"
                aria-label={bookmark.manga[0].title}
            />
            <button
                onClick={(e) => {
                    e.preventDefault()
                    setIsOpen(!isOpen)
                }}
                className="absolute top-1 right-1 z-30 rounded p-1 hover:bg-neutral-800/70"
            >
                <EllipsisVertical className="w-4 text-gray-500" />
            </button>
            {isOpen && (
                <BookmarkActionsMenu
                    bookmark={bookmark}
                    setIsOpen={setIsOpen}
                />
            )}
            <div className="relative isolate flex aspect-2/3 w-30 shrink-0 rounded">
                <Image
                    src={bookmark.manga[0].cover_url || noCover}
                    alt={bookmark.manga[0].title}
                    loading="lazy"
                    fill
                    sizes="120px"
                    className="rounded object-cover"
                />
            </div>
            <div className="relative flex w-full flex-col justify-between gap-1">
                <div>
                    <h3 className="pr-5 text-lg leading-5.5 font-semibold text-wrap">
                        {bookmark.manga[0].title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                        {bookmark.manga[0].author}
                    </p>
                </div>
                {totalChapters && totalChapters > 0 ? (
                    <div>
                        <Link
                            href={`/manga/${bookmark.manga[0].id}/chapter/${lastReadChapter ?? 1}`}
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
}
