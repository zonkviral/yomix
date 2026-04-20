"use client"
import { memo, useCallback, useState } from "react"

import { MangaCard } from "@/components/MangaCard/MangaCard"
import { List } from "@/components/List/List"
import { Pagination } from "@/components/Pagination/Pagination"

import { useMangaList } from "@/hooks/useMangaList"

import { EnrichedManga } from "@/utils/enrichManga"

const DiscoverCatalog = () => {
    const [page, setPage] = useState(0)
    const { items, totalPages, isLoading } = useMangaList(page)
    const renderItem = useCallback(
        (item: EnrichedManga) => <MangaCard {...item} />,
        [],
    )
    return (
        <section className="mt-8.75">
            <div className="mb-6 flex items-baseline justify-between">
                <h2 className="text-4xl font-bold">Каталог</h2>
            </div>

            <div className="relative">
                {isLoading && (
                    <div className="absolute inset-0 z-10 rounded-lg bg-black/20" />
                )}
                <List
                    items={items}
                    className="grid list-none grid-cols-1 gap-4 2xl:grid-cols-2"
                    listClassName="relative select-text"
                    keyExtractor={(item) => item.manga.id}
                    renderItem={renderItem}
                />
            </div>
            <Pagination
                page={page}
                totalPages={totalPages}
                isLoading={isLoading}
                onPageChange={setPage}
            />
        </section>
    )
}
export const Discover = memo(DiscoverCatalog)
