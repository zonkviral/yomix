import "server-only"
import { unstable_cache } from "next/cache"

import { createServiceClient } from "../service"

import type { Bookmark } from "../type"
import type { ChapterSource } from "@/lib/chapters/types"

interface ContinueReadingRow {
    id: string
    read_status: Bookmark["read_status"]
    created_at: string
    updated_at: string
    manga_id: string
    manga_title: string | null
    manga_cover_url: string | null
    manga_total_chapters: number | null
    manga_author: string | null
    external_id: string
    reading_source: ChapterSource
    chapter_id: string | null
    chapter_number: number
    page_number: number | null
}

export const getContinueReading = (userId: string, systemLang: string) =>
    unstable_cache(
        async (): Promise<Bookmark[]> => {
            const { data, error } = await createServiceClient().rpc("get_continue_reading", {
                p_user_id: userId,
                p_system_lang: systemLang,
            })
            if (error) {
                console.error("getContinueReading error:", error.message)
                return []
            }

            return ((data ?? []) as ContinueReadingRow[]).map((row) => ({
                id: row.id,
                read_status: row.read_status,
                created_at: row.created_at,
                updated_at: row.updated_at,
                manga: {
                    id: row.manga_id,
                    external_id: row.external_id,
                    title: row.manga_title ?? "",
                    cover_url: row.manga_cover_url ?? undefined,
                    total_chapters: row.manga_total_chapters ?? undefined,
                    author: row.manga_author ?? undefined,
                    reading_progress: [
                        {
                            chapter_id: row.chapter_id ?? "",
                            chapter_number: row.chapter_number,
                            page_number: row.page_number ?? 1,
                            source: row.reading_source,
                        },
                    ],
                },
            }))
        },
        [`continue-reading-${userId}-${systemLang}`],
        { tags: [`continue-reading-${userId}`] },
    )()
