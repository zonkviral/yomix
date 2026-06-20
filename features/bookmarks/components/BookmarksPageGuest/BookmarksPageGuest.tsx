"use client"

import { useEffect, useMemo, useState } from "react"
import { BookmarksLayout } from "../BookmarksLayout/BookmarksLayout"
import { useBookmarksStore } from "../../store/bookmarks.store"
import { useDebounce } from "@/hooks/useDebounce"
import { PAGE_SIZE } from "@/lib/supabase/queries/bookmarks.constants"

const DEFAULT_FILTERS = {
    q: "",
    status: "all",
    collectionId: "",
    sort: "created_at:desc",
}

export const BookmarksPageGuest = () => {
    const init = useBookmarksStore((s) => s.init)
    const bookmarks = useBookmarksStore((s) => s.bookmarks)
    const hydrated = useBookmarksStore((s) => s.hydrated)

    const [filters, setFilters] = useState(DEFAULT_FILTERS)
    const [page, setPage] = useState(0)
    const debouncedQ = useDebounce(filters.q, 300)

    useEffect(() => {
        init(true)
    }, [])

    useEffect(() => {
        setPage(0)
    }, [debouncedQ, filters.status, filters.sort])

    const handleFilterChange = (updates: Record<string, string>) => {
        setFilters((prev) => ({ ...prev, ...updates }))
    }

    const continueReading = useMemo(
        () =>
            bookmarks
                .filter((b) => (b.manga.reading_progress?.length ?? 0) > 0)
                .slice(0, 10),
        [bookmarks],
    )

    const recentlyAdded = useMemo(() => {
        return [...bookmarks]
            .sort(
                (a, b) =>
                    new Date(b.created_at).getTime() -
                    new Date(a.created_at).getTime(),
            )
            .slice(0, 4)
    }, [bookmarks])

    const { filtered, statusCounts } = useMemo(() => {
        const counts = bookmarks.reduce(
            (acc, b) => {
                acc[b.read_status] = (acc[b.read_status] ?? 0) + 1
                return acc
            },
            {} as Record<string, number>,
        )

        let result = [...bookmarks]

        if (debouncedQ) {
            const q = debouncedQ.toLowerCase()
            result = result.filter((b) =>
                b.manga.title.toLowerCase().includes(q),
            )
        }
        if (filters.status !== "all") {
            result = result.filter((b) => b.read_status === filters.status)
        }

        const [sortBy, sortDir] = filters.sort.split(":")
        result.sort((a, b) => {
            if (sortBy === "title") {
                const cmp = a.manga.title.localeCompare(b.manga.title, "ru")
                return sortDir === "asc" ? cmp : -cmp
            }
            const key = sortBy as "created_at" | "updated_at"
            const diff = new Date(b[key]).getTime() - new Date(a[key]).getTime()
            return sortDir === "asc" ? -diff : diff
        })

        return { filtered: result, statusCounts: counts }
    }, [bookmarks, debouncedQ, filters.status, filters.sort])

    const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

    return (
        <BookmarksLayout
            bookmarks={paged}
            totalCount={filtered.length}
            continueReading={continueReading}
            recentlyAdded={recentlyAdded}
            showSavePrompt
            loading={!hydrated}
            filters={filters}
            page={page}
            statusCounts={statusCounts}
            isPending={false}
            onFilterChange={handleFilterChange}
            onPageChange={setPage}
        />
    )
}
