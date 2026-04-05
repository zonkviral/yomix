"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"

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
        if (error) {
            console.log("Error fetching profile:", error)
        }

        if (data?.username !== null) {
            setUsername(data?.username)
            return
        }

        if (retries > 0) {
            await new Promise((r) => setTimeout(r, 600))
            return fetchProfile(userId, retries - 1)
        }

        setUsername(null)
    }

    useEffect(() => {
        let mounted = true

        const init = async () => {
            const { data } = await supabase.auth.getUser()

            if (!mounted) return

            const currentUser = data.user ?? null
            setUser(currentUser)

            if (currentUser) await fetchProfile(currentUser.id)

            setLoading(false)
        }

        init()

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (!mounted) return

            setLoading(true)

            const currentUser = session?.user ?? null
            setUser(currentUser)

            if (currentUser) {
                await fetchProfile(currentUser.id)
            } else {
                setUsername(null)
            }

            setLoading(false)
        })

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
