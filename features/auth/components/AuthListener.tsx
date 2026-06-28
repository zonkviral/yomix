"use client"

import { useEffect, useRef } from "react"
import { useRouter } from "next/navigation"

import { useBookmarksStore } from "@/features/bookmarks/store/bookmarks.store"
import { createClient } from "@/lib/supabase/client"

import { Session } from "@supabase/supabase-js"

export const AuthListener = () => {
    const router = useRouter()
    const isInitialEvent = useRef(true)

    useEffect(() => {
        const supabase = createClient()

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(
            (event: string, session: Session | null) => {
                if (isInitialEvent.current) {
                    isInitialEvent.current = false
                    return
                }

                if (!session) {
                    useBookmarksStore.getState().init(true)
                }

                if (event === "SIGNED_IN" || event === "SIGNED_OUT") {
                    router.refresh()
                }
            },
        )

        return () => subscription.unsubscribe()
    }, [router])

    return null
}
