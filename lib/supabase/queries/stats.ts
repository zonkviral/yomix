import { createClient } from "../server"

export const getUserStats = async (
    userId: string,
): Promise<{ total_chapters: number } | null> => {
    const supabase = await createClient()

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
}
