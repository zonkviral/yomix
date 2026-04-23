"use client"

import { useEffect, useState } from "react"

import { useAuth } from "@/context/AuthContext"

import { addBookmark, removeBookmark } from "@/features/bookmarks/actions"

import {
    addLocalBookmark,
    getLocalBookmarks,
    removeLocalBookmark,
} from "../services/local-storage"

import { MangaSource } from "@/lib/supabase/type"

export const useBookmark = (
    mangaId: string,
    initialState: boolean,
    manga?: MangaSource,
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
                            externalId: mangaId,
                            source: manga.source,
                            title: manga.title,
                            author: manga.author,
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
