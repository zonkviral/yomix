"use client"
import { useState } from "react"

import { menuItems } from "../../constants"

import { List } from "@/components/ui/List/List"

import { useBookmarksStore } from "../../store/bookmarks.store"

import { Bookmark } from "@/lib/supabase/type"

import { ChevronDown, Check } from "lucide-react"

interface BookmarkActionsMenuProps {
    bookmark: Bookmark
    setIsOpen: (val: boolean) => void
}

export const BookmarkActionsMenu = ({
    bookmark,
    setIsOpen,
}: BookmarkActionsMenuProps) => {
    const { updateStatus, remove } = useBookmarksStore()
    const [submenuOpen, setSubmenuOpen] = useState(false)
    const toggleMenu = () => setSubmenuOpen((prev) => !prev)
    const handleMenuItemClick = (action: string, mangaId: string) => {
        switch (action) {
            case "change-read-status":
                toggleMenu()
                break
            case "remove":
                remove(mangaId)
                setIsOpen(false)
                break
            default:
                break
        }
    }
    return (
        <List
            items={menuItems}
            className="absolute right-7 z-30 rounded bg-neutral-800 p-2 text-sm text-white shadow"
            keyExtractor={(item) => item.label}
            listClassName="relative"
            renderItem={(item) => {
                const Icon = item.icon
                return (
                    <>
                        <button
                            onClick={() =>
                                handleMenuItemClick(
                                    item.id,
                                    bookmark.manga[0].id,
                                )
                            }
                            className={`flex w-full cursor-pointer items-center rounded px-2 py-1.5 transition-colors hover:bg-neutral-700/50 ${
                                item.danger
                                    ? "text-rose-500"
                                    : "text-white/80 hover:text-white"
                            }`}
                        >
                            {Icon && <Icon className="mr-2 h-4 w-4" />}
                            <span>{item.label}</span>
                            {item.options && (
                                <ChevronDown
                                    className={`ml-1 w-4 text-white/70 transition-all ${submenuOpen ? "rotate-180" : ""}`}
                                />
                            )}
                        </button>

                        {submenuOpen && item.options && (
                            <List
                                items={item.options}
                                className="absolute top-full right-0 z-40 mt-1 w-max rounded bg-neutral-700 p-1 text-sm shadow"
                                keyExtractor={(option) => option.value}
                                renderItem={(option) => {
                                    const Icon = option.icon
                                    return (
                                        <button
                                            onClick={() => {
                                                updateStatus(
                                                    bookmark.manga[0].id,
                                                    option.value,
                                                )
                                                setIsOpen(false)
                                            }}
                                            className="flex w-full items-center rounded px-2 py-1 text-left hover:bg-neutral-600"
                                        >
                                            {Icon && (
                                                <Icon
                                                    className={`mr-2 w-4 ${option.color}`}
                                                />
                                            )}
                                            <span>{option.label}</span>
                                            {bookmark.read_status ===
                                                option.value && (
                                                <Check className="ml-1.5 w-3" />
                                            )}
                                        </button>
                                    )
                                }}
                            />
                        )}
                    </>
                )
            }}
        />
    )
}
