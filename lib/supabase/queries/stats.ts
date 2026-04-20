import { createClient } from "../server"
import { UserStats } from "../type"

export const getUserStats = async (
    userId: string,
): Promise<UserStats | null> => {
    const supabase = await createClient()

    const [statsResult, completedResult] = await Promise.all([
        supabase
            .from("user_stats")
            .select("total_chapters, total_time_mins")
            .eq("user_id", userId)
            .single(),

        supabase
            .from("bookmarks")
            .select("*", { count: "exact", head: true })
            .eq("user_id", userId)
            .eq("read_status", "completed"),
    ])

    if (statsResult.error) return null

    return {
        total_chapters: statsResult.data.total_chapters,
        total_time_mins: statsResult.data.total_time_mins,
        total_manga: completedResult.count ?? 0,
    }
}
