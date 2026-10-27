import "server-only"

import { unstable_cache } from "next/cache"

import { createServiceClient } from "../service"
import { resolveTitles } from "./resolve-titles"

import { Bookmark } from "../type"

export const getRecentlyAdded = (userId: string, systemLang: string) =>
    unstable_cache(
        async () => {
            const supabase = createServiceClient()

            const { data } = await supabase
                .from("bookmarks")
                .select(
                    `
                    id, read_status, created_at, updated_at,
                    manga (id, cover_url, total_chapters, external_id)
                `,
                )
                .eq("user_id", userId)
                .order("created_at", { ascending: false })
                .limit(4)

            const rows = (data ?? []) as unknown as Bookmark[]
            const titles = await resolveTitles(
                supabase,
                rows.map((r) => r.manga.id),
                systemLang,
            )

            return rows.map((r) => ({
                ...r,
                manga: { ...r.manga, title: titles.get(r.manga.id) ?? "", reading_progress: [] },
            })) as Bookmark[]
        },
        [`recently-added-${userId}-${systemLang}`],
        { tags: [`recently-added-${userId}`] },
    )()
