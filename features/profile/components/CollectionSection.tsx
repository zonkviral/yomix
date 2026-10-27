import Image from "next/image"
import Link from "next/link"

import { SectionCard } from "@/components/ui/SectionCard/SectionCard"
import { List } from "@/components/ui/List/List"

import { cn } from "@/utils/cn"

const cover =
    "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimg.freepik.com%2Fpremium-photo%2Fcartoon-anime-style-comic-book-cover-young-beautiful-girl-wallpaper-background_782419-936884.jpg&f=1&nofb=1&ipt=9da9b97949dd92b89bfb1578656cc14dac0f5543e34eff23db2187830a23ae81"
const min = 10
const max = 30
const mockData = [
    {
        title: "Хуйня из под коня",
        cover_url: cover,
        count: Math.floor(Math.random() * (max - min + 1)) + min,
    },
    {
        title: "Топ хуйня",
        cover_url: cover,
        count: Math.floor(Math.random() * (max - min + 1)) + min,
    },
    {
        title: "Random title",
        cover_url: cover,
        count: Math.floor(Math.random() * (max - min + 1)) + min,
    },
    {
        title: "Random title",
        cover_url: cover,
        count: Math.floor(Math.random() * (max - min + 1)) + min,
    },
]

const Items = ({ title, cover, count }: { title: string; cover: string; count: number }) => (
    <Link
        href="#"
        className="flex w-56 flex-col overflow-hidden rounded-lg transition-transform hover:scale-105"
    >
        <div className="relative aspect-4/4 w-full">
            <Image src={cover} fill alt="cover" className="object-cover" />
        </div>
        <div
            className={cn(
                "px-2 py-1.5",
                "shadow-xs shadow-black/30",
                "bg-[#1a1524bf]/70 backdrop-blur-2xl",
            )}
        >
            <h3 className="line-clamp-1 text-lg font-semibold text-white">{title}</h3>
            <span className="text-gray-500">{count} тайтла</span>
        </div>
    </Link>
)

export const CollectionSection = () => {
    return (
        <SectionCard
            className="py-4"
            title="Коллекция"
            action={
                <button className="text-[#f43f5e] first-letter:uppercase hover:underline">
                    показать все
                </button>
            }
        >
            <List
                className="flex gap-8.5 pt-5 pl-px"
                listClassName="shadow-xs shadow-black/30 "
                items={mockData}
                renderItem={(item) => (
                    <Items title={item.title} cover={item.cover_url} count={item.count} />
                )}
            />
        </SectionCard>
    )
}
