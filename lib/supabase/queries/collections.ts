import { PostgrestError } from "@supabase/supabase-js"

import { createClient } from "../server"

import { Collection } from "../type"

export const getUserCollections = async (userId: string) => {
    const supabase = await createClient()

    const {
        data,
        error,
    }: { data: Collection[] | null; error: PostgrestError | null } =
        await supabase
            .from("lists")
            .select(
                "id, name, color, icon, is_public, position, list_items (count)",
            )
            .eq("user_id", userId)
            .order("position", { ascending: true })

    if (error) return []
    return (data ?? []).map((col) => ({
        ...col,
        item_count: col.list_items?.[0]?.count ?? 0,
    }))
}
