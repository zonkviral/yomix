"use client"

import { useCallback } from "react"

import { usePathname, useRouter, useSearchParams } from "next/navigation"

import * as DropdownMenu from "@radix-ui/react-dropdown-menu"

import { List } from "@/components/ui/List/List"

import { useBookmarksStore } from "../../store/bookmarks.store"

import { menuItems } from "../../constants/menu"

import { Bookmark, ReadStatus } from "@/lib/supabase/type"

import { EllipsisVertical, ChevronRight, Check } from "lucide-react"

import { cn } from "@/utils/cn"

interface BookmarkActionsMenuProps {
    bookmark: Bookmark
    openAddToCollectionModal: () => void
}

export const BookmarkActionsMenu = ({
    bookmark,
    openAddToCollectionModal,
}: BookmarkActionsMenuProps) => {
    const { updateStatus, remove, collections, bookmarks } = useBookmarksStore()

    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()

    const mangaId = bookmark.manga.id
    const externalId = bookmark.manga.manga_sources?.[0]?.external_id ?? ""

    const handleAction = useCallback(
        async (itemId: string) => {
            if (itemId === "remove") {
                await remove(externalId)

                const currentPage = Number(searchParams.get("page") ?? 0)
                const itemsOnCurrentPage = bookmarks.length

                if (currentPage > 0 && itemsOnCurrentPage <= 1) {
                    const params = new URLSearchParams(searchParams.toString())
                    params.set("page", String(currentPage - 1))
                    router.push(`${pathname}?${params.toString()}`, {
                        scroll: false,
                    })
                }
                return
            }
            const actions: Record<string, () => void> = {
                "add-to-collection": () => {
                    openAddToCollectionModal()
                },
                "edit-note": () => {
                    /* open note modal */
                },
            }
            actions[itemId]?.()
        },
        [remove, openAddToCollectionModal, externalId],
    )

    const handleStatusChange = useCallback(
        async (status: ReadStatus) => {
            await updateStatus(mangaId, status)
        },
        [updateStatus, mangaId],
    )

    return (
        <DropdownMenu.Root modal={false}>
            <DropdownMenu.Trigger
                onClick={(e) => e.preventDefault()}
                className={cn(
                    "absolute top-0.5 right-0.5 z-20 rounded bg-neutral-950 p-1 opacity-0 transition-opacity outline-none group-hover/actionMenu:opacity-100 hover:bg-neutral-700 data-[state=open]:opacity-100",
                )}
            >
                <EllipsisVertical className="w-4" />
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
                <DropdownMenu.Content
                    align="end"
                    sideOffset={4}
                    collisionPadding={8}
                    className="z-50 w-54 rounded bg-neutral-800 p-2 text-sm text-white shadow"
                >
                    <List
                        items={menuItems}
                        keyExtractor={(item) => item.label}
                        renderItem={(item) => {
                            if (
                                item.id === "add-to-collection" &&
                                collections.length === 0
                            )
                                return
                            const Icon = item.icon
                            if (item.options) {
                                return (
                                    <DropdownMenu.Sub>
                                        <DropdownMenu.SubTrigger className="flex w-full cursor-pointer items-center rounded px-2 py-1.5 text-white/80 transition-colors outline-none hover:bg-neutral-700/50 hover:text-white data-[state=open]:bg-neutral-700/50 data-[state=open]:text-white">
                                            {Icon && (
                                                <Icon className="mr-2 h-4 w-4" />
                                            )}
                                            <span>{item.label}</span>
                                            <ChevronRight className="ml-auto w-4 text-white/70" />
                                        </DropdownMenu.SubTrigger>

                                        <DropdownMenu.Portal>
                                            <DropdownMenu.SubContent
                                                sideOffset={8}
                                                collisionPadding={8}
                                                className="z-50 w-48 rounded bg-neutral-800 p-1 text-sm text-white shadow"
                                            >
                                                {item.options.map((option) => {
                                                    const OptionIcon =
                                                        option.icon
                                                    const isActive =
                                                        bookmark.read_status ===
                                                        option.value
                                                    return (
                                                        <DropdownMenu.Item
                                                            key={option.value}
                                                            onSelect={() =>
                                                                handleStatusChange(
                                                                    option.value,
                                                                )
                                                            }
                                                            className="flex w-full cursor-pointer items-center rounded px-2 py-1.5 transition-colors outline-none hover:bg-neutral-700/50 hover:text-white"
                                                        >
                                                            {OptionIcon && (
                                                                <OptionIcon
                                                                    className={`mr-2 w-4 ${option.color}`}
                                                                />
                                                            )}
                                                            <span>
                                                                {option.label}
                                                            </span>
                                                            {isActive && (
                                                                <Check className="ml-auto w-3" />
                                                            )}
                                                        </DropdownMenu.Item>
                                                    )
                                                })}
                                            </DropdownMenu.SubContent>
                                        </DropdownMenu.Portal>
                                    </DropdownMenu.Sub>
                                )
                            }

                            return (
                                <DropdownMenu.Item
                                    onSelect={() => {
                                        void handleAction(item.id)
                                    }}
                                    className={`flex w-full cursor-pointer items-center rounded px-2 py-1.5 transition-colors outline-none hover:bg-neutral-700/50 ${
                                        item.danger
                                            ? "text-rose-500"
                                            : "text-white/80 hover:text-white"
                                    }`}
                                >
                                    {Icon && <Icon className="mr-2 h-4 w-4" />}
                                    <span>{item.label}</span>
                                </DropdownMenu.Item>
                            )
                        }}
                    />
                </DropdownMenu.Content>
            </DropdownMenu.Portal>
        </DropdownMenu.Root>
    )
}
