"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { Session, User } from "@supabase/supabase-js"
import { useBookmarksStore } from "@/features/bookmarks/store/bookmarks.store"

type AuthContextType = {
    user: User | null
    username: string | null
    loading: boolean
    refreshAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    username: null,
    loading: true,
    refreshAuth: async () => {},
})

const supabase = createClient()

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null)
    const [username, setUsername] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)

    const fetchProfile = async (userId: string, retries = 3): Promise<void> => {
        const { data, error } = await supabase
            .from("profiles")
            .select("username")
            .eq("id", userId)
            .maybeSingle()

        if (error) console.error("Error fetching profile:", error)

        if (data?.username) {
            setUsername(data.username)
            return
        }

        if (retries > 0) {
            await new Promise((r) => setTimeout(r, 600))
            return fetchProfile(userId, retries - 1)
        }

        setUsername(null)
        setLoading(false)
    }

    useEffect(() => {
        let mounted = true

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(
            async (event: string, session: Session) => {
                if (!mounted) return

                const currentUser = session?.user ?? null
                setUser(currentUser)

                if (currentUser) {
                    const bookmarks = await fetch("/api/bookmarks")
                        .then((r) => r.json())
                        .catch(() => [])

                    useBookmarksStore.getState().init(false, bookmarks)
                    await fetchProfile(currentUser.id)
                } else {
                    useBookmarksStore.getState().init(true)
                    setUsername(null)
                }

                setLoading(false)
            },
        )

        return () => {
            mounted = false
            subscription.unsubscribe()
        }
    }, [])

    const refreshAuth = async () => {
        setLoading(true)
        const { data } = await supabase.auth.getUser()
        const currentUser = data.user ?? null
        setUser(currentUser)
        if (currentUser) {
            await fetchProfile(currentUser.id)
        } else {
            setUsername(null)
        }
        setLoading(false)
    }

    return (
        <AuthContext.Provider value={{ user, username, loading, refreshAuth }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
