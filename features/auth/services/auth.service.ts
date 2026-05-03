"use client"
import { createClient } from "@/lib/supabase/client"

export const loginClient = async (email: string, password: string) => {
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
    })
    if (error) return { error: error.message }
    return { success: true }
}

export const logoutClient = async () => {
    const supabase = createClient()
    const { error } = await supabase.auth.signOut()
    if (error) return { error: error.message }
    return { success: true }
}
