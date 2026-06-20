import { useState } from "react"

import { colorsMap } from "@/features/bookmarks/constants/collection-colors"
import { iconMap } from "@/features/bookmarks/constants/icons"
import { useBookmarksStore } from "@/features/bookmarks/store/bookmarks.store"

import { List } from "@/components/ui/List/List"
import { Modal } from "@/components/ui/Modal/Modal"

import { CollectionButton } from "../CollectionButton/CollectionButton"
import { CollectionForm } from "../CollectionForm/CollectionForm"

import { useModal } from "@/hooks/useModal"

import { Collection } from "@/lib/supabase/type"

import { GripHorizontal, PenBox, Trash2 } from "lucide-react"

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
    const { removeCollection } = useBookmarksStore()

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
            <List
                className="flex flex-col"
                items={collections}
                keyExtractor={(col) => col.id}
                renderItem={(col) => {
                    const isActive = activeCollectionId === col.id
                    const Icon = iconMap[col.icon]
                    const color = colorsMap[col.color]
                    return (
                        <div key={col.id} className="flex">
                            <CollectionButton
                                isActive={isActive}
                                icon={
                                    Icon && <Icon className={`w-4 ${color}`} />
                                }
                                isEditable={edit}
                                label={col.name}
                                count={col.list_items?.[0]?.count ?? 0}
                                onClick={() => handleCollectionClick(col.id)}
                            />
                            {edit && (
                                <div className="ml-auto flex gap-2">
                                    <button
                                        className="ml-2 rounded text-sm text-neutral-200 hover:bg-rose-500/10"
                                        onClick={() => {
                                            setSelectedCollection(col)
                                            open()
                                        }}
                                    >
                                        <PenBox className="w-4" />
                                    </button>
                                    <button className="ml-1 rounded text-sm text-neutral-500 hover:bg-rose-500/10">
                                        <GripHorizontal className="w-4" />
                                    </button>
                                    <button
                                        className="ml-1 rounded text-sm text-red-400 hover:bg-rose-500/10"
                                        onClick={() => removeCollection(col.id)}
                                    >
                                        <Trash2 className="w-4" />
                                    </button>
                                </div>
                            )}
                        </div>
                    )
                }}
            />
            <Modal
                isOpen={isOpen}
                onClose={close}
                className="mx-auto flex max-w-xl text-amber-50"
            >
                {selectedCollection && (
                    <CollectionForm
                        onSuccess={close}
                        collection={selectedCollection}
                    />
                )}
            </Modal>
        </div>
    )
}
