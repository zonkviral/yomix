"use client"

import { useEffect } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { BookmarksLayout } from "../BookmarksLayout/BookmarksLayout"
import { useBookmarksStore } from "../../store/bookmarks.store"
import { Bookmark, Collection } from "@/lib/supabase/type"
import useSWR from "swr"

interface BookmarksPageAuthProps {
    continueReading?: Bookmark[]
    recentlyAdded?: Bookmark[]
    stats: { total_chapters: number } | null
    collections: Collection[]
    statusCounts: Record<string, number>
}

interface BookmarksResponse {
    bookmarks: Bookmark[]
    total: number
}

const fetcher = (url: string): Promise<BookmarksResponse> =>
    fetch(url).then((r) => r.json())

export const BookmarksPageAuth = ({
    continueReading,
    recentlyAdded,
    stats,
    collections,
    statusCounts,
}: BookmarksPageAuthProps) => {
    const init = useBookmarksStore((s) => s.init)
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const storeCollections = useBookmarksStore((s) => s.collections)

    const apiUrl = `/api/bookmarks?${searchParams.toString()}`
    const { data, isLoading } = useSWR<BookmarksResponse>(apiUrl, fetcher, {
        keepPreviousData: true,
    })

    useEffect(() => {
        init(false, data?.bookmarks ?? [], collections)
    }, [data?.bookmarks, collections])

    const navigate = (updates: Record<string, string>) => {
        const params = new URLSearchParams(searchParams.toString())
        Object.entries(updates).forEach(([k, v]) =>
            v ? params.set(k, v) : params.delete(k),
        )
        params.delete("page")
        router.push(`${pathname}?${params.toString()}`)
    }

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set("page", String(newPage))
        router.push(`${pathname}?${params.toString()}`)
    }
    const filters = {
        q: searchParams.get("q") ?? undefined,
        status: searchParams.get("status") ?? undefined,
        sort: searchParams.get("sort") ?? undefined,
        collectionId: searchParams.get("collection") ?? undefined,
    }
    const page = Math.max(0, Number(searchParams.get("page") ?? 0))

    return (
        <BookmarksLayout
            continueReading={continueReading}
            recentlyAdded={recentlyAdded}
            bookmarks={data?.bookmarks ?? []}
            totalCount={data?.total ?? 0}
            collections={storeCollections}
            statusCounts={statusCounts}
            stats={stats}
            filters={filters}
            page={page}
            isPending={isLoading}
            onFilterChange={navigate}
            onPageChange={handlePageChange}
        />
    )
}
