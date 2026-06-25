import "server-only"
import { unstable_cache } from "next/cache"

import { createServiceClient } from "../service"

import { Bookmark } from "../type"

export const getContinueReading = (userId: string) =>
    unstable_cache(
        async () => {
            const supabase = createServiceClient()

            const { data, error } = await supabase.rpc("get_continue_reading", {
                p_user_id: userId,
            })

            if (error) {
                console.error("getContinueReading error:", error.message)
                return []
            }

            return (data ?? []).map((row) => ({
                id: row.id,
                read_status: row.read_status,
                created_at: row.created_at,
                updated_at: row.updated_at,
                manga: {
                    id: row.manga_id,
                    title: row.manga_title,
                    cover_url: row.manga_cover_url,
                    total_chapters: row.manga_total_chapters,
                    author: row.manga_author,
                    manga_sources: row.external_id
                        ? [
                              {
                                  source: row.source,
                                  external_id: row.external_id,
                              },
                          ]
                        : [],
                    reading_progress: [
                        {
                            chapter_id: row.chapter_id,
                            chapter_number: row.chapter_number,
                            page_number: row.page_number,
                        },
                    ],
                },
            })) as unknown as Bookmark[]
        },
        [`continue-reading-${userId}`],
        { tags: [`continue-reading-${userId}`] },
    )()
