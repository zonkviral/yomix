import { getUserBookmarks } from "@/lib/supabase/queries/bookmarks"
import { createClient } from "@/lib/supabase/server"

export const GET = async () => {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) return Response.json([], { status: 401 })

    const bookmarks = await getUserBookmarks(user.id)
    return Response.json(bookmarks)
}
