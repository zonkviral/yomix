"use client"

import * as DropdownMenu from "@radix-ui/react-dropdown-menu"

import Image from "next/image"

import {
    // Crown,
    Bookmark,
    User,
    Settings,
    LogOut,
} from "lucide-react"

import { getAvatarUrl } from "@/features/auth/services/avatar"
import { logoutClient } from "@/features/auth/services/auth.service"

import { List } from "@/components/ui/List/List"

import { Banner } from "./Banner"
import { MenuItem, MenuItemConfig } from "./MenuItem"

import { Profile } from "@/lib/supabase/type"

const readingItems: MenuItemConfig[] = [
    { icon: Bookmark, label: "Bookmarks", badge: "128", href: "/bookmarks" },
]

interface UserDropdownMenuProps {
    profile: Profile
}

export const UserDropdownMenu = ({ profile }: UserDropdownMenuProps) => {
    const accountItems: MenuItemConfig[] = [
        { icon: User, label: "Profile", href: `/profile/${profile.username}` },
        { icon: Settings, label: "Settings", href: "/settings" },
    ]

    const src = getAvatarUrl(profile) || ""

    const signOutItem: MenuItemConfig[] = [
        {
            icon: LogOut,
            label: "Sign out",
            danger: true,
            onClick: logoutClient,
        },
    ]

    return (
        <DropdownMenu.Root modal={false}>
            <DropdownMenu.Trigger asChild>
                <button className="relative p-1 outline-none">
                    <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border-2 border-rose-600 bg-neutral-900">
                        <Image
                            src={src}
                            alt="avatar"
                            width={40}
                            height={40}
                            className="h-full w-full object-cover"
                            unoptimized
                        />
                    </div>
                    <span className="absolute right-1 bottom-1 h-2 w-2 rounded-full border-2 border-neutral-900 bg-rose-600" />
                </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
                <DropdownMenu.Content
                    sideOffset={8}
                    align="end"
                    className="z-50 w-60 overflow-hidden rounded-sm border-[1.5px] border-neutral-700 bg-neutral-900 shadow-xl"
                >
                    <Banner profile={profile} />

                    <div className="py-1">
                        <List
                            items={readingItems}
                            keyExtractor={(item) => item.label}
                            renderItem={(item) => <MenuItem {...item} />}
                        />
                    </div>

                    <DropdownMenu.Separator className="h-px bg-neutral-700" />
                    {/* <DropdownMenu.Label className="">Аккаунт</DropdownMenu.Label> */}
                    <div className="py-1">
                        <List
                            items={accountItems}
                            keyExtractor={(item) => item.label}
                            renderItem={(item) => <MenuItem {...item} />}
                        />
                    </div>

                    <DropdownMenu.Separator className="h-px bg-neutral-700" />

                    <div className="py-1">
                        <List
                            items={signOutItem}
                            keyExtractor={(item) => item.label}
                            renderItem={(item) => <MenuItem {...item} />}
                        />
                    </div>
                </DropdownMenu.Content>
            </DropdownMenu.Portal>
        </DropdownMenu.Root>
    )
}
