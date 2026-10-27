import type { SupabaseClient } from "@supabase/supabase-js"

export async function getUserId(supabase: SupabaseClient): Promise<string | null> {
    const { data, error } = await supabase.auth.getClaims()
    return error || !data?.claims?.sub ? null : data.claims.sub
}
