import { createClient } from "../server"
import { Profile } from "../type"

export const getProfile = async (userId: string): Promise<Profile | null> => {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from("profiles")
        .select(
            "username, bio, banner_url, is_public, avatar_type, avatar_seed, avatar_url",
        )
        .eq("id", userId)
        .single()

    if (error) {
        console.error("getProfile error:", error.message)
        return null
    }

    return data as Profile
}
