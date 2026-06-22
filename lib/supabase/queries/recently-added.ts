import "server-only"

import { unstable_cache } from "next/cache"

import { createServiceClient } from "../service"

import { Bookmark } from "../type"

export const getRecentlyAdded = (userId: string) =>
    unstable_cache(
        async () => {
            const supabase = createServiceClient()

            const { data } = await supabase
                .from("bookmarks")
                .select(
                    `
            id, read_status, created_at, updated_at,
            manga (
                id, title, cover_url, total_chapters,
                manga_sources (id, source, external_id),
                reading_progress (chapter_id, chapter_number, page_number)
            )
        `,
                )
                .eq("user_id", userId)
                .order("created_at", { ascending: false })
                .limit(4)

            return (data ?? []) as unknown as Bookmark[]
        },
        [`recently-added-${userId}`],
        { tags: [`recently-added-${userId}`] },
    )()
