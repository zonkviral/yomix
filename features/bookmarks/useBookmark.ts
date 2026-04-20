"use client"

import { useEffect, useState } from "react"

import { useAuth } from "@/context/AuthContext"

import { addBookmark, removeBookmark } from "@/features/bookmarks/actions"

import {
    addLocalBookmark,
    getLocalBookmarks,
    removeLocalBookmark,
} from "./services/local-storage"

export const useBookmark = (
    mangaId: string,
    initialState: boolean,
    manga?: {
        externalId: string
        source: string
        title: string
        coverUrl: string
        totalChapters?: number
    },
) => {
    const { user } = useAuth()

    const [isBookmarked, setIsBookmarked] = useState(initialState)
    const [hasMounted, setHasMounted] = useState(false)

    useEffect(() => {
        if (!user) {
            const local = getLocalBookmarks().some((b) => b.id === mangaId)
            setIsBookmarked(local)
        }
        setHasMounted(true)
    }, [user, mangaId])

    const [loading, setLoading] = useState(false)

    const toggle = async () => {
        if (loading) return
        setLoading(true)
        const wasBookmarked = isBookmarked
        setIsBookmarked(!wasBookmarked)
        try {
            if (user) {
                const result = wasBookmarked
                    ? await removeBookmark(mangaId)
                    : await addBookmark(manga!)
                if (result.error) setIsBookmarked(wasBookmarked)
            } else {
                if (!manga) {
                    setIsBookmarked(wasBookmarked)
                    return
                }
                try {
                    if (wasBookmarked) {
                        removeLocalBookmark(mangaId)
                    } else {
                        addLocalBookmark({
                            mangaId,
                            title: manga.title,
                            coverUrl: manga.coverUrl,
                            totalChapters: manga.totalChapters,
                        })
                    }
                } catch {
                    setIsBookmarked(wasBookmarked)
                }
            }
        } finally {
            setLoading(false)
        }
    }

    return { isBookmarked, loading, toggle, hasMounted }
}
