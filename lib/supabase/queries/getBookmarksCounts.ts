import { createClient } from "../server"

export const getBookmarkStatusCounts = async (
    userId: string,
): Promise<Record<string, number>> => {
    const supabase = await createClient()
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
}
