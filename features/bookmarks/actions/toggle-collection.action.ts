"use server"

import { updateTag } from "next/cache"

import { createClient } from "@/lib/supabase/server"
import { resolveMangaId } from "@/lib/supabase/resolveMangaId"
import { UUID_RE } from "@/lib/supabase/constants"
import { getUserId } from "@/lib/supabase/getUserId"

export const toggleCollectionAction = async (
    collectionId: string,
    externalId: string,
    add: boolean,
) => {
    if (!UUID_RE.test(collectionId)) return { error: "Invalid collection" }

    const supabase = await createClient()
    const userId = await getUserId(supabase)

    if (!userId) return { error: "Not authenticated" }

    const mangaId = await resolveMangaId(supabase, externalId)
    if (!mangaId) return { error: "Manga not found" }

    const { error } = add
        ? await supabase
              .from("collection_items")
              .upsert(
                  { list_id: collectionId, manga_id: mangaId },
                  { onConflict: "list_id,manga_id", ignoreDuplicates: true },
              )
        : await supabase
              .from("collection_items")
              .delete()
              .eq("list_id", collectionId)
              .eq("manga_id", mangaId)

    if (error) return { error: error.message }

    updateTag(`collections-${userId}`)
    return { success: true }
}
