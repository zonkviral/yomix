"use client"

import { useEffect, useState } from "react"

import * as DropdownMenu from "@radix-ui/react-dropdown-menu"

import { useDebounce } from "@/hooks/useDebounce"

import { Search, ChevronDown, Check } from "lucide-react"

const SORT_OPTIONS = [
    { value: "created_at:desc", label: "Сначала новые" },
    { value: "created_at:asc", label: "Сначала старые" },
    { value: "updated_at:desc", label: "По обновлению" },
    { value: "title:asc", label: "По названию" },
] as const

interface BookmarksFiltersProps {
    currentQ: string
    currentSort: string
    isPending: boolean
    onFilterChange: (updates: Record<string, string>) => void
}

export const BookmarksFilters = ({
    currentQ,
    currentSort,
    isPending,
    onFilterChange,
}: BookmarksFiltersProps) => {
    const [searchValue, setSearchValue] = useState(currentQ)
    const debouncedSearch = useDebounce(searchValue, 300)

    const currentLabel =
        SORT_OPTIONS.find((o) => o.value === currentSort)?.label ?? "Сортировка"

    useEffect(() => {
        if (debouncedSearch === currentQ) return
        onFilterChange({ q: debouncedSearch })
    }, [debouncedSearch])

    useEffect(() => {
        setSearchValue(currentQ)
    }, [currentQ])

    return (
        <div className="flex items-center gap-3">
            <div className="relative flex-1">
                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <input
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder="Поиск по названию..."
                    className="w-full rounded-lg bg-[#17151a] py-2 pr-4 pl-9 text-sm outline-none placeholder:text-gray-500 focus:ring-1 focus:ring-rose-500/50"
                />
                {isPending && (
                    <span className="absolute top-1/2 right-3 h-3 w-3 -translate-y-1/2 animate-spin rounded-full border border-gray-500 border-t-transparent" />
                )}
            </div>
            <DropdownMenu.Root modal={false}>
                <DropdownMenu.Trigger className="group flex cursor-pointer items-center gap-2 rounded-lg bg-[#17151a] px-3 py-2 text-sm text-gray-300 outline-none data-[state=open]:text-white">
                    {currentLabel}
                    <ChevronDown className="h-4 w-4 text-gray-500 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                </DropdownMenu.Trigger>
                <DropdownMenu.Content
                    sideOffset={4}
                    className="z-50 w-44 rounded-lg bg-[#17151a] p-1 shadow-lg"
                >
                    {SORT_OPTIONS.map((opt) => (
                        <DropdownMenu.Item
                            key={opt.value}
                            onSelect={() => onFilterChange({ sort: opt.value })}
                            className="flex cursor-pointer items-center gap-2 rounded px-3 py-2 text-sm text-gray-300 outline-none data-highlighted:bg-white/5 data-highlighted:text-white"
                        >
                            {opt.label}
                            {opt.value === currentSort && (
                                <Check className="ml-auto h-3 w-3 text-rose-500" />
                            )}
                        </DropdownMenu.Item>
                    ))}
                </DropdownMenu.Content>
            </DropdownMenu.Root>
        </div>
    )
}
