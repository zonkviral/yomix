import { useState } from "react"

import { useModal } from "@/hooks/useModal"

import { SortableList } from "@/components/ui/SortableList/SortableList"

import { colorsMap } from "@/features/bookmarks/constants/collection-colors"
import { iconMap } from "@/features/bookmarks/constants/icons"
import { useBookmarksStore } from "@/features/bookmarks/store/bookmarks.store"

import { CollectionButton } from "../CollectionButton/CollectionButton"
import { CollectionFormModal } from "../CollectionFormModal/CollectionFormModal"

import { Collection } from "@/lib/supabase/type"

import { PenBox, Trash2 } from "lucide-react"

interface UserCollectionsProps {
    collections: Collection[]
    activeCollectionId: string | null
    edit: boolean
    onFilterChange?: (updates: Record<string, string>) => void
}

export const UserCollections = ({
    collections,
    activeCollectionId,
    edit,
    onFilterChange,
}: UserCollectionsProps) => {
    const { close, open, isOpen } = useModal()

    const { reorderCollections, removeCollection } = useBookmarksStore()

    const [selectedCollection, setSelectedCollection] =
        useState<Collection | null>(null)

    const handleCollectionClick = (id: string) => {
        onFilterChange?.({
            collection: id,
            status: "",
        })
    }
    return (
        <div className="mt-2 border-t border-neutral-800 pt-2">
            <h3 className="text-lg font-bold text-neutral-200">
                Мои коллекции
            </h3>

            <SortableList
                items={collections}
                className="flex flex-col"
                onReorder={reorderCollections}
                renderItem={(col, dragHandle) => {
                    const isActive = activeCollectionId === col.id
                    const Icon = iconMap[col.icon]
                    const color = colorsMap[col.color]
                    return (
                        <div className="relative flex">
                            <CollectionButton
                                isActive={isActive}
                                icon={
                                    Icon && <Icon className={`w-4 ${color}`} />
                                }
                                label={col.name}
                                count={
                                    edit
                                        ? undefined
                                        : (col.manga_ids?.length ?? 0)
                                }
                                onClick={
                                    edit
                                        ? () => {}
                                        : () => handleCollectionClick(col.id)
                                }
                            />
                            {edit && (
                                <div className="flex items-center gap-2">
                                    <button
                                        className="h-fit rounded px-1 py-0.5 text-sm text-neutral-200 hover:bg-neutral-700"
                                        onClick={() => {
                                            setSelectedCollection(col)
                                            open()
                                        }}
                                    >
                                        <PenBox className="h-fit w-4" />
                                    </button>
                                    {dragHandle}
                                    <button
                                        className="h-fit rounded px-1 py-0.5 text-sm text-red-400 hover:bg-neutral-700"
                                        onClick={() => removeCollection(col.id)}
                                    >
                                        <Trash2 className="h-fit w-4" />
                                    </button>
                                </div>
                            )}
                        </div>
                    )
                }}
            />

            {selectedCollection && (
                <CollectionFormModal
                    isOpen={isOpen}
                    close={close}
                    collection={selectedCollection}
                />
            )}
        </div>
    )
}
