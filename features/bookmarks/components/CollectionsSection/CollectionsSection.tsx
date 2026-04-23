import { defaultCollections } from "../../constants"

import { SideSectionWrapper } from "../SideSectionWrapper/SideSectionWrapper"

import { List } from "@/components/ui/List/List"

import { Bookmark, Collection } from "@/lib/supabase/type"

import Link from "next/link"

interface CollectionsSectionProps {
    collections?: Collection[]
    bookmarks?: Bookmark[]
}

export const CollectionsSection = ({
    collections,
    bookmarks,
}: CollectionsSectionProps) => {
    return (
        <SideSectionWrapper title="Коллекции">
            <List
                className="mt-4 flex flex-col gap-1"
                items={defaultCollections}
                renderItem={(collection) => (
                    <Link
                        href={`/collections/${collection.value}`}
                        className="group/item flex w-full items-center gap-4 rounded p-1"
                    >
                        {collection.icon && (
                            <collection.icon
                                className={`w-4 ${collection.color}`}
                            />
                        )}
                        <h4 className="text-lg font-semibold group-hover/item:underline">
                            {collection.label}
                        </h4>
                        <span className="ml-auto text-sm text-white/70">
                            {
                                bookmarks?.filter(
                                    (b) => b.read_status === collection.value,
                                ).length
                            }
                        </span>
                    </Link>
                )}
            />
            {collections && collections.length > 0 && (
                <div>
                    <h3>Мои коллекции</h3>
                    <List
                        className="mt-4 flex flex-col gap-2"
                        items={collections}
                        keyExtractor={(collection) => collection.id}
                        renderItem={(collection) => (
                            <Link
                                href={`/collections/${collection.id}`}
                                className="flex items-center gap-4 rounded p-1 hover:underline"
                            >
                                {/* <span className="text-lg">{collection.iconValue}</span> */}
                                <h4 className="text-lg font-semibold">
                                    {collection.name}
                                </h4>
                            </Link>
                        )}
                    />
                </div>
            )}
        </SideSectionWrapper>
    )
}
