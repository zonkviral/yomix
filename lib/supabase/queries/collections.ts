import { createClient } from "../server"
import { Collection } from "../type"

export const getUserCollections = async (userId: string) => {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from("lists")
        .select("id, name, is_public, position")
        .eq("user_id", userId)
        .order("position", { ascending: true })

    if (error) return []
    return (data ?? []) as Collection[]
}
