import { unstable_cache } from "next/cache"

import { createServiceClient } from "../service"

export const getUserStats = (userId: string) =>
    unstable_cache(
        async () => {
            const supabase = createServiceClient()

            const [statsResult] = await Promise.all([
                supabase
                    .from("user_stats")
                    .select("total_chapters")
                    .eq("user_id", userId)
                    .single(),
            ])

            if (statsResult.error) return null

            return {
                total_chapters: statsResult.data.total_chapters || 0,
            }
        },
        [`user-stats-${userId}`],
        { tags: [`user-stats-${userId}`] },
    )()
