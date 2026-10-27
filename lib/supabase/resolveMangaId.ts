import type { SupabaseClient } from "@supabase/supabase-js"

export async function resolveMangaId(supabase: SupabaseClient, externalId: string) {
    const { data } = await supabase
        .from("manga")
        .select("id")
        .eq("external_id", externalId)
        .maybeSingle()
    return (data?.id as string | undefined) ?? null
}
