"use client"

import { useEffect, useTransition } from "react"

import useSWR from "swr"

import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { BookmarksLayout } from "../BookmarksLayout/BookmarksLayout"

import { useBookmarksStore } from "../../store/bookmarks.store"

import { Bookmark, Collection } from "@/lib/supabase/type"

interface BookmarksPageAuthProps {
    continueReading: Bookmark[]
    recentlyAdded: Bookmark[]
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
    const [isPending, startTransition] = useTransition()

    const init = useBookmarksStore((s) => s.init)
    const setMutateBookmarks = useBookmarksStore((s) => s.setMutateBookmarks)

    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const storeBookmarks = useBookmarksStore((s) => s.bookmarks)
    const apiUrl = `/api/bookmarks?${searchParams.toString()}`

    const { data, isLoading, mutate } = useSWR<BookmarksResponse>(
        apiUrl,
        fetcher,
        {
            keepPreviousData: true,
            revalidateOnFocus: false,
        },
    )
    useEffect(() => {
        setMutateBookmarks(mutate)
    }, [mutate])

    useEffect(() => {
        init(false, [], collections, {
            continueReading,
            recentlyAdded,
            statusCounts,
            stats,
        })
    }, [])
    useEffect(() => {
        useBookmarksStore.setState({
            continueReading,
            recentlyAdded,
            stats,
        })
    }, [continueReading, recentlyAdded, stats])

    useEffect(() => {
        if (data?.bookmarks) {
            useBookmarksStore.setState({ bookmarks: data.bookmarks })
        }
    }, [data?.bookmarks])

    const navigate = (updates: Record<string, string>) => {
        const params = new URLSearchParams(searchParams.toString())
        Object.entries(updates).forEach(([k, v]) =>
            v ? params.set(k, v) : params.delete(k),
        )
        params.delete("page")
        if ("q" in updates) {
            router.push(`${pathname}?${params.toString()}`, { scroll: false })
            return
        }
        startTransition(() => {
            router.push(`${pathname}?${params.toString()}`, { scroll: false })
        })
    }

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set("page", String(newPage))
        startTransition(() => {
            router.push(`${pathname}?${params.toString()}`, { scroll: false })
        })
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
            bookmarks={storeBookmarks}
            totalCount={data?.total ?? 0}
            filters={filters}
            page={page}
            loading={isLoading}
            isPending={isPending}
            onFilterChange={navigate}
            onPageChange={handlePageChange}
        />
    )
}
