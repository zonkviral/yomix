import noCover from "@/assets/no_cover.webp"
import Image from "next/image"
import Link from "next/link"

import { ProgressBar } from "@/components/ProgressBar/ProgressBar"
import { getLastChapter } from "@/lib/bookmarks/helpers"
import { Bookmark } from "@/lib/supabase/type"
import { EllipsisVertical } from "lucide-react"

interface BookmarkRowProps {
    bookmark: Bookmark
}

export const BookmarkRow = ({ bookmark }: BookmarkRowProps) => {
    const lastReadChapter = getLastChapter(bookmark)
    return (
        <div className="relative flex gap-4 rounded p-1 hover:bg-neutral-900">
            <button className="absolute top-1 right-1 z-120 rounded p-1 hover:bg-neutral-800/70">
                <EllipsisVertical className="w-4 text-gray-500" />
            </button>
            <div className="relative isolate flex aspect-2/3 w-30 shrink-0 rounded">
                <Image
                    src={bookmark.manga[0].cover_url || noCover}
                    alt={bookmark.manga[0].title}
                    fill
                    className="rounded object-cover"
                />
            </div>
            <div className="relative flex w-full flex-col justify-between gap-1 p-2">
                <div>
                    <h3 className="pr-5 text-lg font-semibold text-wrap">
                        {bookmark.manga[0].title}
                    </h3>
                    <p className="text-sm text-gray-500">
                        {/* {bookmark.manga[0].author} */}
                        Author
                    </p>
                </div>
                <div>
                    {/* <span className="mt-auto rounded-xl bg-neutral-800/70 px-2 py-1 text-sm text-gray-500">
                        Глава {getLastChapter(bookmark) ?? 0}
                    </span> */}
                    <Link
                        href={`/manga/${bookmark.manga[0].id}`}
                        className="mt-2 block rounded p-1 hover:bg-neutral-800"
                    >
                        <ProgressBar
                            current={lastReadChapter ?? 0}
                            total={bookmark.manga[0].total_chapters ?? 0}
                        />
                    </Link>
                </div>
            </div>
        </div>
    )
}
