import { memo, useCallback } from "react"

import { List } from "@/components/List/List"

import { Clock, Trash2 } from "lucide-react"

interface RecentSearchesProps {
    onSelect: (q: string) => void
    searches: string[]
    onRemove: (q: string) => void
}

export const RecentSearches = memo(
    ({ onSelect, searches, onRemove }: RecentSearchesProps) => {
        const renderItem = useCallback(
            (q: string) => (
                <>
                    <Clock className="w-3.5 shrink-0 text-white/20" />
                    <button
                        className="flex-1 text-left text-sm text-white/50 hover:text-white/80"
                        onClick={() => onSelect(q)}
                    >
                        {q}
                    </button>
                    <button
                        className="text-rose-400/20 hover:text-rose-400/60"
                        onClick={() => onRemove(q)}
                    >
                        <Trash2 className="w-4" />
                    </button>
                </>
            ),
            [onSelect, onRemove],
        )
        if (!searches.length) return null

        return (
            <div className="mt-2">
                <p className="px-3 pb-1 text-[10px] font-medium tracking-widest text-white/30 uppercase">
                    Недавние
                </p>
                <List
                    items={searches}
                    renderItem={renderItem}
                    keyExtractor={(q) => q}
                    listClassName="flex items-center gap-3 rounded-lg px-2 py-1 hover:bg-white/5"
                />
            </div>
        )
    },
)
