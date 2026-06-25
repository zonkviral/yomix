import "server-only"

import { createServiceClient } from "../service"
import { unstable_cache } from "next/cache"

export const getBookmarkStatusCounts = async (userId: string) =>
    unstable_cache(
        async () => {
            const supabase = createServiceClient()
            const { data } = await supabase
                .from("bookmarks")
                .select("read_status")
                .eq("user_id", userId)

            return (data ?? []).reduce(
                (acc, b) => {
                    acc[b.read_status] = (acc[b.read_status] ?? 0) + 1
                    return acc
                },
                {} as Record<string, number>,
            )
        },
        [`status-counts-${userId}`],
        { tags: [`status-counts-${userId}`] },
    )()
