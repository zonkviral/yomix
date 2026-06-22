import "server-only"
import { PostgrestError } from "@supabase/supabase-js"

import { unstable_cache } from "next/cache"
import { createServiceClient } from "../service"
import { Collection } from "../type"

export const getUserCollections = (userId: string) =>
    unstable_cache(
        async () => {
            const supabase = createServiceClient()

            const {
                data,
                error,
            }: { data: Collection[] | null; error: PostgrestError | null } =
                await supabase.rpc("get_user_collections", {
                    p_user_id: userId,
                })
            if (error) {
                console.error("getUserCollections error:", error.message)
                return []
            }
            return data ?? []
        },
        [`collections-${userId}`],
        { tags: [`collections-${userId}`] },
    )()
