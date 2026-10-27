import Image from "next/image"
import Link from "next/link"

import { SectionCard } from "@/components/ui/SectionCard/SectionCard"
import { List } from "@/components/ui/List/List"

import { cn } from "@/utils/cn"

import { Bookmark, Circle, Star } from "lucide-react"

const cover =
    "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimg.freepik.com%2Fpremium-photo%2Fcartoon-anime-style-comic-book-cover-young-beautiful-girl-wallpaper-background_782419-936884.jpg&f=1&nofb=1&ipt=9da9b97949dd92b89bfb1578656cc14dac0f5543e34eff23db2187830a23ae81"

const BookmarkCard = () => (
    <div
        className={cn(
            "group relative my-2 grid grid-cols-[auto_1fr_auto] items-stretch gap-3 rounded-lg border-b border-zinc-800/80 py-1 transition-colors last:border-b-0 hover:bg-white/3",
        )}
    >
        <Link href="#12" className="absolute inset-0 z-10" aria-label="Открыть тайтл">
            <span className="sr-only">Открыть тайтл</span>
        </Link>

        <div className="relative aspect-square w-25 overflow-hidden rounded">
            <Image
                src={cover}
                fill
                alt="cover"
                className="object-cover transition-transform duration-300 group-hover:scale-110"
            />
        </div>

        <div className="flex min-w-0 flex-col justify-between pr-3">
            <div className="flex min-w-0 flex-col">
                <h5 className="line-clamp-2 font-bold wrap-break-word transition-colors group-hover:text-[#f43f5e]">
                    Tiasdassadasdsdasadsdasasdasdasdasdaasdasdasdsdaddsadsadsadsadsasdasdasdasdadadaasdasdadasasaasasastle
                </h5>
                <h6 className="text-gray-500">Author</h6>
            </div>
            <div className="grid w-fit grid-cols-[auto_1fr_auto] items-center text-sm text-gray-400">
                <span>status</span>
                <Circle className="mx-2 w-1.5 fill-[#f43f5e] text-[#f43f5e]" />
                <span>Глава 67</span>
            </div>
        </div>

        <div className="relative z-20 flex items-center divide-x divide-zinc-800/80">
            <div className="flex flex-col items-end justify-end gap-1 pr-3">
                <div className="flex items-center gap-1 text-amber-400">
                    <Star className="w-4 fill-amber-400" />
                    <span>9.37</span>
                </div>
                <span className="text-sm text-gray-400">22 мин. назад</span>
            </div>
            <button
                aria-label="Убрать из закладок"
                className="self-stretch px-4 text-gray-400 transition-colors hover:text-[#f43f5e]"
            >
                <Bookmark className="m-auto w-5" />
            </button>
        </div>
    </div>
)

export const RecentBookmarks = () => (
    <SectionCard
        title="Недавние Закладки"
        action={
            <Link
                href="/bookmarks/username"
                className="text-[#f43f5e] first-letter:uppercase hover:underline"
            >
                Показать все
            </Link>
        }
    >
        <List items={[0, 1, 2, 3]} renderItem={() => <BookmarkCard />} />
    </SectionCard>
)
