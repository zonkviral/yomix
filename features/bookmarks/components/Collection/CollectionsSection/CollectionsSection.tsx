import { useState } from "react"

import { useModal } from "@/hooks/useModal"

import { List } from "@/components/ui/List/List"

import { SideSectionWrapper } from "../../SideSectionWrapper/SideSectionWrapper"
import { CollectionFormModal } from "../CollectionFormModal/CollectionFormModal"
import { CollectionButton } from "../CollectionButton/CollectionButton"
import { UserCollections } from "../UserCollections/UserCollections"

import { useBookmarksStore } from "../../../store/bookmarks.store"

import { defaultCollections } from "../../../constants/status"

import { Plus } from "lucide-react"

interface CollectionsSectionProps {
    isAuth?: boolean
    statusCounts?: Record<string, number>
    activeStatus?: string
    activeCollectionId?: string
    onFilterChange?: (updates: Record<string, string>) => void
}

export const CollectionsSection = ({
    isAuth = false,
    statusCounts,
    activeStatus = "all",
    activeCollectionId = "",
    onFilterChange,
}: CollectionsSectionProps) => {
    const { close, open, isOpen } = useModal()
    const [edit, setEdit] = useState(false)
    const collections = useBookmarksStore((s) => s.collections)

    const handleStatusClick = (value: string) => {
        onFilterChange?.({
            status: value === "all" ? "" : value,
            collection: "",
        })
    }

    return (
        <SideSectionWrapper
            title="Коллекции"
            isEditable={isAuth}
            onEdit={() => setEdit(!edit)}
        >
            <List
                className="mt-4 flex flex-col gap-1"
                items={defaultCollections}
                renderItem={(collection) => {
                    const collectionValue = collection.value as string
                    const isActive =
                        !activeCollectionId &&
                        (activeStatus === collectionValue ||
                            (collectionValue === "all" && !activeStatus))
                    const totalCount = Object.values(statusCounts ?? {}).reduce(
                        (a, b) => a + b,
                        0,
                    )
                    return (
                        <CollectionButton
                            isActive={isActive}
                            icon={
                                collection.icon && (
                                    <collection.icon
                                        className={`w-4 ${collection.color}`}
                                    />
                                )
                            }
                            label={collection.label}
                            count={
                                collectionValue === "all"
                                    ? totalCount
                                    : (statusCounts?.[collection.value] ?? 0)
                            }
                            onClick={() => handleStatusClick(collection.value)}
                        />
                    )
                }}
            />
            {collections && collections.length !== 0 && (
                <UserCollections
                    collections={collections}
                    activeCollectionId={activeCollectionId}
                    edit={edit}
                    onFilterChange={onFilterChange}
                />
            )}
            {isAuth && collections && collections.length < 12 && (
                <>
                    <div className="flex justify-center border-t border-neutral-800">
                        <button
                            className="mt-2 flex w-full items-center rounded-md bg-neutral-800 p-2 text-left text-base transition-colors hover:bg-neutral-800/40"
                            onClick={open}
                        >
                            <Plus className="mr-1 w-4 text-rose-600" />
                            <span>Создать коллекцию</span>
                        </button>
                    </div>
                    <CollectionFormModal isOpen={isOpen} close={close} />
                </>
            )}
        </SideSectionWrapper>
    )
}
