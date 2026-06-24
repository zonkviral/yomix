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

    const fetchProfile = async (
        userId: string,
        retries = 3,
    ): Promise<string | null> => {
        const { data, error } = await supabase
            .from("profiles")
            .select("username")
            .eq("id", userId)
            .maybeSingle()

        if (error) console.error("Error fetching profile:", error)

        if (data?.username) return data.username

        if (retries > 0) {
            await new Promise((r) => setTimeout(r, 600))
            return fetchProfile(userId, retries - 1)
        }

        return null
    }

    useEffect(() => {
        let mounted = true

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(
            async (event: string, session: Session | null) => {
                if (!mounted) return

                const currentUser = session?.user ?? null
                setUser(currentUser)

                if (currentUser) {
                    const fetchedUsername = await fetchProfile(currentUser.id)
                    if (mounted) setUsername(fetchedUsername)
                } else {
                    useBookmarksStore.getState().init(true)
                    setUsername(null)
                }

                if (mounted) setLoading(false)
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
            const fetchedUsername = await fetchProfile(currentUser.id)
            setUsername(fetchedUsername)
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
