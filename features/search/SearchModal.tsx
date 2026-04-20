"use client"
import { useCallback, useEffect, useState, useTransition } from "react"

import { getSearchResultAction, SearchResult } from "../search/actions"
import {
    addRecentSearch,
    getRecentSearches,
    removeRecentSearch,
} from "../search/utils/recentSearches"
import { ResultList } from "./ResultList"
import { RecentSearches } from "./RecentSearches"

import { AnimatedBorder } from "@/components/ui/AnimatedBorder/AnimatedBorder"

import { useDebounce } from "@/hooks/useDebounce"

import { Delete, Search, X } from "lucide-react"

interface SearchModalProps {
    closeModal: () => void
}

export const SearchModal = ({ closeModal }: SearchModalProps) => {
    const [query, setQuery] = useState("")
    const [results, setResults] = useState<SearchResult[]>([])
    const [isPending, startTransition] = useTransition()
    const [recentSearches, setRecentSearches] = useState<string[]>([])

    const debouncedQuery = useDebounce(query, 500)
    useEffect(() => {
        setRecentSearches(getRecentSearches())
    }, [])
    useEffect(() => {
        if (!debouncedQuery.trim()) {
            setResults([])
            return
        }
        startTransition(async () => {
            const { result } = await getSearchResultAction(debouncedQuery)
            setResults(result)
            if (result.length > 0) {
                addRecentSearch(debouncedQuery)
                setRecentSearches(getRecentSearches())
            }
        })
    }, [debouncedQuery])

    const handleRemove = useCallback((q: string) => {
        removeRecentSearch(q)
        setRecentSearches(getRecentSearches())
    }, [])
    const isEmpty = !query.trim()
    const isTyping = query !== debouncedQuery

    return (
        <>
            <AnimatedBorder
                isAnimating={isPending}
                className="mx-auto flex w-full overflow-hidden rounded-xl p-px"
            >
                <div className="relative z-10 flex w-full items-stretch rounded-xl bg-[#101217]">
                    <div className="flex items-center pl-4">
                        <Search className="w-4 shrink-0 text-amber-50/50" />
                    </div>
                    <div className="relative flex flex-1">
                        <input
                            placeholder="Поиск манги..."
                            autoFocus
                            className="w-full bg-transparent py-2.5 pr-3 pl-2 text-xl text-amber-50 outline-none placeholder:text-white/20"
                            type="search"
                            id="search-manga"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            autoComplete="off"
                        />
                        {query && (
                            <button
                                onClick={() => setQuery("")}
                                className="absolute right-0 px-4 py-3 text-white/40 hover:text-white"
                            >
                                <Delete className="w-4" strokeWidth={2} />
                            </button>
                        )}
                    </div>
                    <button
                        onClick={closeModal}
                        className="flex h-full items-center rounded-l-none border-amber-500/10 px-4 transition-colors hover:bg-white/5"
                    >
                        <X className="w-5 text-rose-500/80" />
                    </button>
                </div>
            </AnimatedBorder>
            {isEmpty && (
                <RecentSearches
                    searches={recentSearches}
                    onSelect={setQuery}
                    onRemove={handleRemove}
                />
            )}
            {!isEmpty && (
                <ResultList
                    results={results}
                    query={debouncedQuery}
                    isPending={isPending}
                    isTyping={isTyping}
                />
            )}
        </>
    )
}
