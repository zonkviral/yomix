import "server-only"

import { createServiceClient } from "@/lib/supabase/service"

import type { CanonicalManga } from "./fetchCanonicalManga"
import { toTitleRows } from "./titles"

export async function saveCanonicalManga(
    items: CanonicalManga[],
): Promise<{ ids: Map<string, string> } | { error: string }> {
    if (items.length === 0) return { ids: new Map() }
    const admin = createServiceClient()

    const { data: rows, error } = await admin
        .from("manga")
        .upsert(
            items.map((m) => ({
                external_id: m.externalId,
                author: m.author,
                status: m.status,
                cover_url: m.coverUrl,
                total_chapters: m.totalChapters,
                genres: m.genres,
            })),
            { onConflict: "external_id" },
        )
        .select("id, external_id")
    if (error || !rows) return { error: error?.message ?? "Failed to save manga" }

    const ids = new Map<string, string>(rows.map((r) => [r.external_id as string, r.id as string]))

    const titleRows = items.flatMap((m) => {
        const id = ids.get(m.externalId)
        return id ? toTitleRows(id, m.titles) : []
    })
    if (titleRows.length > 0) {
        const { error: titlesError } = await admin
            .from("manga_titles")
            .upsert(titleRows, { onConflict: "manga_id,lang,title", ignoreDuplicates: true })
        if (titlesError) return { error: titlesError.message }
    }

    return { ids }
}
