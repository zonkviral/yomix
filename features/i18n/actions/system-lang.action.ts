"use server"

import { cookies } from "next/headers"

import { createClient } from "@/lib/supabase/server"

const SUPPORTED = ["ru", "en"]
const COOKIE = { maxAge: 60 * 60 * 24 * 365, path: "/" }

export const updateSystemLang = async (lang: string) => {
    if (!SUPPORTED.includes(lang)) return { error: "Unsupported language" }
    ;(await cookies()).set("system_lang", lang, COOKIE)

    const supabase = await createClient()
    const { data } = await supabase.auth.getClaims()
    const userId = data?.claims?.sub
    if (userId) {
        const { error } = await supabase
            .from("profiles")
            .update({ system_lang: lang })
            .eq("id", userId)
        if (error) return { error: error.message }
    }
    return { success: true }
}

export const syncSystemLangFromProfile = async () => {
    const supabase = await createClient()
    const { data } = await supabase.auth.getClaims()
    const userId = data?.claims?.sub
    if (!userId) return

    const { data: profile } = await supabase
        .from("profiles")
        .select("system_lang")
        .eq("id", userId)
        .maybeSingle()
    if (profile?.system_lang && SUPPORTED.includes(profile.system_lang)) {
        ;(await cookies()).set("system_lang", profile.system_lang, COOKIE)
    }
}
