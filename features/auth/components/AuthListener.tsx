"use client"

import { useEffect, useRef } from "react"

import { useRouter } from "next/navigation"

import type { AuthChangeEvent, Session } from "@supabase/supabase-js"

import { useBookmarksStore } from "@/features/bookmarks/store/bookmarks.store"
import { migrateLocalBookmarks } from "@/features/bookmarks/actions/migrate.action"
import { clearLocalBookmarks, getLocalBookmarks } from "@/features/bookmarks/services/local-storage"

import { createClient } from "@/lib/supabase/client"

export const AuthListener = () => {
    const router = useRouter()
    const migrating = useRef(false)

    useEffect(() => {
        const supabase = createClient()

        const migrateGuestData = async (): Promise<boolean> => {
            if (migrating.current) return false
            const local = getLocalBookmarks()
            if (local.length === 0) return false

            migrating.current = true
            try {
                const result = await migrateLocalBookmarks(local)
                if (result.error || (result.failed?.length ?? 0) > 0) return false
                clearLocalBookmarks()
                return true
            } finally {
                migrating.current = false
            }
        }

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
            if (event === "INITIAL_SESSION" || event === "SIGNED_IN") {
                if (!session) {
                    useBookmarksStore.getState().init(true)
                    return
                }
                useBookmarksStore.setState({ isGuest: false })
                setTimeout(async () => {
                    const migrated = await migrateGuestData()
                    if (migrated || event === "SIGNED_IN") router.refresh()
                }, 0)
                return
            }

            if (event === "SIGNED_OUT") {
                useBookmarksStore.getState().init(true)
                router.refresh()
            }
        })

        return () => subscription.unsubscribe()
    }, [router])

    return null
}
