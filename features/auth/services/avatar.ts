import { Profile } from "@/lib/supabase/type"

export const getAvatarUrl = (profile: Profile | null) => {
    if (profile && profile.avatar_type === "upload" && profile.avatar_url) {
        return profile.avatar_url
    }
    return encodeURI(
        `https://api.dicebear.com/10.x/fun-emoji/svg?seed=${profile?.avatar_seed}`,
    )
}
