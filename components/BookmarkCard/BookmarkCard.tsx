import noCover from "@/assets/no_cover.webp"

import Image from "next/image"
import Link from "next/link"

import { EllipsisVertical } from "lucide-react"

import { ProgressBar } from "@/components/ProgressBar/ProgressBar"
import { Bookmark } from "@/lib/supabase/type"
import { getLastChapter } from "@/lib/bookmarks/helpers"

// const menuItems = [
//     {
//         label: "Статус чтения",
//         options: [
//             { value: "reading",      label: "Читаю" },
//             { value: "completed",    label: "Прочитано" },
//             { value: "plan_to_read", label: "Запланировано" },
//             { value: "dropped",      label: "Брошено" },
//             { value: "on_hold",      label: "На паузе" },
//         ]
//     },
//     { label: "Добавить в коллекцию" },
//     { label: "Поставить оценку" },
//     { label: "Удалить из закладок", danger: true },
// ]

interface BookmarkCardProps {
    bookmark: Bookmark
}

export const BookmarkCard = ({ bookmark }: BookmarkCardProps) => {
    const lastChapter = getLastChapter(bookmark)
    return (
        <div className="relative rounded bg-neutral-900/50">
            <div className="relative isolate flex aspect-2/3 w-50 shrink-0 flex-col rounded">
                <Image
                    src={bookmark.manga[0].cover_url || noCover}
                    alt={bookmark.manga[0].title}
                    fill
                    className="rounded object-cover"
                />
                <button className="absolute top-1 right-1 z-120 rounded p-1 hover:bg-neutral-800/70">
                    <EllipsisVertical className="w-3 text-amber-50" />
                </button>
                {bookmark.manga[0].total_chapters !== null &&
                    bookmark.manga[0].total_chapters > 0 && (
                        <p className="absolute bottom-0 left-1/2 mb-2 w-max -translate-x-1/2 rounded-full bg-neutral-800/70 px-2 py-1 text-sm text-gray-500">
                            Глава {bookmark.manga[0].total_chapters}
                        </p>
                    )}
            </div>
            <div className="p-2">
                <h3 className="text-lg font-semibold">
                    {bookmark.manga[0].title}
                </h3>
                {/* <p className="text-sm text-gray-500">{bookmark.manga[0].author}</p> */}
                <Link
                    href={`/manga/${bookmark.manga[0].id}`}
                    className="mt-2 block rounded p-1 hover:bg-neutral-800"
                >
                    <ProgressBar
                        current={lastChapter ?? 0}
                        total={bookmark.manga[0].total_chapters ?? 0}
                    />
                </Link>
            </div>
        </div>
    )
}
