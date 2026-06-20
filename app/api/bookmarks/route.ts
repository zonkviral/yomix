import { getUserBookmarks } from "@/lib/supabase/queries/bookmarks"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 })

    const filters = {
        q: searchParams.get("q") ?? undefined,
        status: searchParams.get("status") ?? undefined,
        sort: searchParams.get("sort") ?? undefined,
        collectionId: searchParams.get("collection") ?? undefined,
        page: Number(searchParams.get("page") ?? 0),
    }

    const { data, count } = await getUserBookmarks(user.id, filters)
    return Response.json({ bookmarks: data, total: count })
}
