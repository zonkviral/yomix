"use client"

import { useState } from "react"

import { MangaCard } from "../MangaCard/MangaCard"
import { List } from "../List/List"
import { Pagination } from "../Pagination/Pagination"

import { useMangaList } from "@/hooks/useMangaList"

export const Discover = () => {
    const [page, setPage] = useState(0)
    const { items, totalPages, isLoading } = useMangaList(page)

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
                    list={items}
                    className="grid list-none grid-cols-1 gap-4 2xl:grid-cols-2"
                    listClassName="relative select-text"
                    keyExtractor={(item) => item.manga.id}
                    renderItem={(item) => <MangaCard {...item} />}
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
