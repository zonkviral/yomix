import { useState } from "react"

import { useSearchParams } from "next/navigation"

import { useSWRConfig } from "swr"

import { List } from "@/components/ui/List/List"
import { Modal } from "@/components/ui/Modal/Modal"

import { useBookmarksStore } from "../../store/bookmarks.store"
import { isInCollectionHandler } from "../../store/helpers"

import { iconMap } from "../../constants/icons"
import { colorsMap } from "../../constants/collection-colors"

import { cn } from "@/utils/cn"

import { Bookmark } from "@/lib/supabase/type"

import { Check } from "lucide-react"

interface AddtoCollectionModalProps {
    isOpen: boolean
    close: () => void
    bookmark: Bookmark
}

export const AddToCollectionModal = ({
    isOpen,
    close,
    bookmark,
}: AddtoCollectionModalProps) => {
    const { collections, toggleCollection } = useBookmarksStore()
    const [loadingId, setLoadingId] = useState<string | null>(null)

    const searchParams = useSearchParams()
    const { mutate } = useSWRConfig()
    const apiUrl = `/api/bookmarks?${searchParams.toString()}`

    const toggleCollectionHandler = async (
        collectionId: string,
        mangaId: string,
    ) => {
        setLoadingId(collectionId)
        await toggleCollection(collectionId, mangaId)
        setLoadingId(null)

        const activeCollection = searchParams.get("collection")
        if (activeCollection === collectionId) {
            mutate(apiUrl)
        }
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={close}
            className="backdrop:backdrop-blur-[2px]"
            contentClassName="bg-[#0f1115] px-0 pb-0"
        >
            <div className="md:min-w-80">
                <div className="px-4">
                    <h3 className="text-xl font-bold text-white">
                        Добавить в коллекцию
                    </h3>
                    <h4 className="mt-2 text-lg text-gray-400">
                        Мои коллекции
                    </h4>
                </div>
                <List
                    className={cn(
                        "bg-app mt-2 flex w-full flex-col gap-2 overflow-hidden rounded px-4 py-2 ring-2 ring-neutral-950/60",
                    )}
                    items={collections}
                    renderItem={(col) => {
                        const Icon = iconMap[col.icon]
                        const color = colorsMap[col.color]
                        const isInCollection = isInCollectionHandler(
                            col,
                            bookmark.manga.id,
                        )
                        return (
                            <label
                                className={cn(
                                    "group/checkbox",
                                    "focus-within:ring-2 focus-within:ring-rose-500/80 focus-within:outline-none",
                                    "rounded-lg shadow-xs/20 inset-ring-2 inset-ring-neutral-950/50",
                                    "flex items-center justify-between",
                                    "hover:bg-secondary w-full cursor-pointer px-2 py-3 text-white",
                                    loadingId === col.id &&
                                        "pointer-events-none opacity-50",
                                )}
                            >
                                <input
                                    type="checkbox"
                                    className="sr-only"
                                    checked={isInCollection}
                                    disabled={loadingId === col.id}
                                    onChange={() =>
                                        toggleCollectionHandler(
                                            col.id,
                                            bookmark.manga.id,
                                        )
                                    }
                                />
                                <span
                                    className={cn(
                                        "relative mr-2 flex h-5 w-5 items-center justify-center rounded border-2 border-neutral-500",
                                        "group-focus-within/checkbox:border-rose-500/45 group-hover/checkbox:border-rose-500/45",
                                        isInCollection &&
                                            "border-0 bg-rose-600/65",
                                    )}
                                >
                                    {isInCollection && (
                                        <Check className="w-4 stroke-3 text-neutral-900" />
                                    )}
                                </span>
                                {Icon && (
                                    <Icon
                                        className={cn(
                                            "w-7 rounded bg-neutral-900 px-1 py-px shadow",
                                            color,
                                        )}
                                    />
                                )}
                                <span className="flex-1 pl-2 text-base">
                                    {col.name}
                                </span>
                                <span className="ml-auto pr-1 pl-4 text-sm text-gray-400">
                                    {col.manga_ids?.length ?? 0}
                                </span>
                            </label>
                        )
                    }}
                />
            </div>
        </Modal>
    )
}
