"use client"

import Image from "next/image"
import Link from "next/link"

import { List } from "@/components/ui/List/List"

import { SectionWrapper } from "./SectionWrapper"

import { cn } from "@/utils/cn"

import { CalendarMinus2Icon, EllipsisVertical, Pencil } from "lucide-react"
// import { ProfileBanner } from "./ProfileBanner"

const userStats = [
    { label: "Закладок", value: 121 },
    { label: "Прочитано", value: 121 },
    { label: "Коллекций", value: 12 },
    { label: "Лайков", value: "8.4k" },
    { label: "Подписчики", value: 121 },
    { label: "xxx", value: 156 },
]

export const ProfileHeader = () => {
    const username = "username"

    const copy = () => navigator.clipboard.writeText(username)

    return (
        <SectionWrapper className="col-span-2 px-12">
            {/* <ProfileBanner
        bannerUrl={profile.banner_url}
        isOwnProfile={currentUser?.id === profile.id} */}
            {/* /> */}
            <div className="ml-auto grid grid-cols-[1fr_auto] py-10">
                <div className="flex gap-6">
                    <div className="relative h-45 w-45 self-center rounded-full border-3 border-rose-950">
                        <Image
                            src="https://api.dicebear.com/10.x/fun-emoji/svg?seed=16082314"
                            alt="avatar"
                            fill
                            unoptimized
                            className="rounded-full object-cover"
                        />
                    </div>
                    <div className="flex w-3xs flex-col justify-end gap-1">
                        <span className="text-xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
                            Name
                        </span>
                        <span
                            onClick={() => copy()}
                            className="w-fit cursor-pointer text-sm text-gray-600 backdrop-saturate-100 hover:text-gray-400"
                        >
                            @username
                        </span>
                        <p className="text-sm text-gray-500">
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit, sed do eiusmod tempor incididunt ut labore et
                            dolore magna
                        </p>
                        <div className="mt-2 flex items-center">
                            <CalendarMinus2Icon className="w-4 text-rose-800/80" />
                            <span className="ml-1 text-sm text-gray-600">
                                На сайте с 12 апр. 2023
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex items-end justify-end gap-3">
                    <Link
                        href="/settings"
                        className={cn(
                            "group relative flex w-fit items-center gap-3",
                            "rounded border border-white/10",
                            "bg-[#1a1524bf] backdrop-blur-3xl",
                            "px-3 py-1.5 text-sm text-[#f43f5e]",
                            "shadow-lg shadow-black/30",
                            "transition-all duration-300 ease-out",
                            "overflow-hidden",

                            "hover:bg-rose-500/10",
                            "hover:border-rose-500/30",
                            "hover:shadow-rose-500/15",
                            "hover:-translate-y-px",
                            "active:translate-y-0",
                        )}
                    >
                        <Pencil className="relative w-3.5 opacity-90 transition-transform duration-300 group-hover:rotate-12" />
                        <span className="relative">Редактировать профиль</span>
                    </Link>

                    <button
                        className={cn(
                            "group relative flex w-fit items-center gap-3",
                            "rounded border border-white/10",
                            "bg-[#1a1524bf] backdrop-blur-3xl",
                            "px-1.5 py-1.5 text-sm text-[#f43f5e]",
                            "shadow-lg shadow-black/30",
                            "transition-all duration-300 ease-out",
                            "overflow-hidden",

                            "hover:bg-rose-500/10",
                            "hover:border-rose-500/30",
                            "hover:shadow-rose-500/15",
                            "hover:-translate-y-px",
                            "active:translate-y-0",
                        )}
                    >
                        <EllipsisVertical className="w-5 transition-transform duration-300" />
                    </button>
                </div>
            </div>
            <List
                items={userStats}
                className={cn(
                    "flex items-center justify-between gap-4",
                    "divide-x divide-solid divide-zinc-800/80",
                    "shadow-xs shadow-black/30",
                    "rounded bg-[#1a1524bf]/90 p-4 backdrop-blur-2xl",
                )}
                listClassName="flex w-full flex-col items-center justify-center"
                keyExtractor={(item) => item.label}
                renderItem={(item) => (
                    <>
                        <span className="text-xl text-[#f43f5e]">
                            {item.value}
                        </span>
                        <span className="text-lg text-gray-600">
                            {item.label}
                        </span>
                    </>
                )}
            />
        </SectionWrapper>
    )
}
