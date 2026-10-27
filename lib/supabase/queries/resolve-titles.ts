import type { SupabaseClient } from "@supabase/supabase-js"

export const resolveTitles = async (
    client: SupabaseClient,
    mangaIds: string[],
    systemLang: string,
) => {
    if (mangaIds.length === 0) return new Map<string, string>()

    const { data, error } = await client.rpc("resolve_manga_titles", {
        p_manga_ids: mangaIds,
        p_system_lang: systemLang,
    })
    if (error) console.error("resolveTitles error:", error.message)

    return new Map<string, string>(
        ((data ?? []) as { manga_id: string; title: string }[]).map((r) => [r.manga_id, r.title]),
    )
}
