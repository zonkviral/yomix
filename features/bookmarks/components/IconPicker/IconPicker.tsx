"use client"

import { useState } from "react"

import { cn } from "@/utils/cn"

import { iconMap, CURATED_ICON_IDS, ALL_ICON_IDS } from "../../constants/icons"

import { Search, MoreHorizontal } from "lucide-react"

interface IconPickerProps {
    value: string
    onChange: (id: string) => void
}

export const IconPicker = ({ value, onChange }: IconPickerProps) => {
    const [expanded, setExpanded] = useState(false)
    const [search, setSearch] = useState("")

    const visibleIds = expanded
        ? ALL_ICON_IDS.filter((id) => id.includes(search.toLowerCase()))
        : CURATED_ICON_IDS

    return (
        <div className="flex flex-col gap-2">
            {expanded && (
                <div className="relative">
                    <Search className="absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-gray-500" />
                    <input
                        autoFocus
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Поиск..."
                        className="w-full rounded-lg bg-neutral-900 py-1.5 pr-3 pl-8 text-sm outline-none placeholder:text-gray-500 focus:ring-1 focus:ring-white/10"
                    />
                </div>
            )}

            <div className="grid grid-cols-5 gap-1.5">
                {visibleIds.map((id) => {
                    const Icon = iconMap[id]
                    return (
                        <button
                            key={id}
                            type="button"
                            onClick={() => onChange(id)}
                            className={cn(
                                "flex items-center justify-center rounded-lg p-2.5 transition-colors",
                                value === id
                                    ? "bg-blue-600 text-white"
                                    : "bg-neutral-900 text-gray-400 hover:bg-neutral-700 hover:text-white",
                            )}
                        >
                            <Icon className="h-5 w-5" />
                        </button>
                    )
                })}

                {!expanded && (
                    <button
                        type="button"
                        onClick={() => setExpanded(true)}
                        className="flex items-center justify-center rounded-lg bg-neutral-900 p-2.5 text-gray-400 transition-colors hover:bg-neutral-700 hover:text-white"
                    >
                        <MoreHorizontal className="h-5 w-5" />
                    </button>
                )}
            </div>

            {expanded && visibleIds.length === 0 && (
                <p className="text-center text-sm text-gray-500">
                    Ничего не найдено
                </p>
            )}
        </div>
    )
}
