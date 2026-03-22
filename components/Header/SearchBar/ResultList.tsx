import { useCallback } from "react"

import { SearchResult } from "@/actions/getSearchResult.action"

import { SearchCard } from "./SearchCard"
import { SkeletonSearchCard } from "./SkeletonSearchCard"

import { List } from "@/components/List/List"

interface ResultListProps {
    results: SearchResult[]
    query: string
    isPending: boolean
    isTyping: boolean
}

export const ResultList = ({
    results,
    query,
    isPending,
    isTyping,
}: ResultListProps) => {
    const renderItem = useCallback(
        (result: SearchResult) => <SearchCard result={result} query={query} />,
        [query],
    )
    const noResults = !isPending && !isTyping && results.length === 0

    return (
        <div className="mt-2">
            {query.length !== 0 && (
                <p className="px-3 pb-1 text-[10px] font-medium tracking-widest text-white/30 uppercase">
                    Результаты:{" "}
                    <span className="text-amber-500">"{query}"</span>
                </p>
            )}
            <hr className="mb-1 h-px border-none bg-linear-to-r from-transparent via-neutral-700 to-transparent" />
            {isPending ? (
                <SkeletonSearchCard />
            ) : noResults ? (
                <p className="px-3 py-4 text-sm text-white/30">
                    По запросу "{query}" ничего не найдено
                </p>
            ) : (
                <List
                    list={results}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.manga.id}
                    className="custom-scroll grid max-h-[calc(100dvh-17rem)] grid-cols-2 gap-2 overflow-y-auto p-2"
                />
            )}
        </div>
    )
}
