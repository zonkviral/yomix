import "server-only"

import { createServiceClient } from "@/lib/supabase/service"

import { fetchCanonicalManga } from "../service/fetchCanonicalManga"
import { saveCanonicalManga } from "../service/saveCanonicalManga"

const MANGADEX_ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export async function ensureManga(externalId: string): Promise<{ id: string } | { error: string }> {
    if (!MANGADEX_ID.test(externalId)) return { error: "Invalid manga id" }

    // Already saved with titles? Done, no MangaDex call.
    const { data: existing } = await createServiceClient()
        .from("manga")
        .select("id, manga_titles(count)")
        .eq("external_id", externalId)
        .maybeSingle()
    if (existing && (existing.manga_titles?.[0]?.count ?? 0) > 0) return { id: existing.id }

    const canonical = await fetchCanonicalManga(externalId)
    if (!canonical) return { error: "Could not load manga" }

    const saved = await saveCanonicalManga([canonical])
    if ("error" in saved) return { error: saved.error }

    const id = saved.ids.get(externalId)
    return id ? { id } : { error: "Failed to save manga" }
}
