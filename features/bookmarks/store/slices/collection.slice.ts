import { createCollection } from "../../actions/create-collection.action"
import { removeCollection } from "../../actions/remove-collection.action"
import { updateCollection } from "../../actions/update-collection.action"
import { reorderCollectionsAction } from "../../actions/reorder-collection.action"
import { toggleCollectionAction } from "../../actions/toggle-collection.action"

import { StoreGet, StoreSet } from "../types"
import { Collection } from "@/lib/supabase/type"

import { isInCollectionHandler } from "../helpers"

export const collectionSlice = (set: StoreSet, get: StoreGet) => ({
    createCollection: async (
        name: string,
        icon: string,
        color: string,
        isPublic?: boolean,
    ) => {
        const result = await createCollection(name, icon, color, isPublic)
        if (result.error) return result

        set((state) => ({
            collections: [
                ...state.collections,
                {
                    id: result.id!,
                    name,
                    icon,
                    color,
                    position: state.collections.length,
                    is_public: isPublic ?? false,
                    user_id: "",
                    description: null,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                },
            ],
        }))

        return result
    },

    updateCollection: async (
        id: string,
        name: string,
        icon: string,
        color: string,
        isPublic: boolean,
    ) => {
        const previous = get().collections

        set((state) => ({
            collections: state.collections.map((c) =>
                c.id === id
                    ? {
                          ...c,
                          name,
                          icon,
                          color,
                          is_public: isPublic ?? c.is_public,
                      }
                    : c,
            ),
        }))

        const result = await updateCollection(id, name, icon, color, isPublic)

        if (result.error) {
            set((state) => ({
                collections: previous ?? state.collections,
            }))
        }

        return result
    },

    toggleCollection: async (collectionId: string, mangaId: string) => {
        const previous = get().collections
        const collection = get().collections.find((c) => c.id === collectionId)
        if (!collection) return { error: "Collection not found" }

        const isInCollection = isInCollectionHandler(collection, mangaId)

        set((state) => ({
            collections: state.collections.map((c) =>
                c.id === collectionId
                    ? {
                          ...c,
                          manga_ids: isInCollection
                              ? c.manga_ids?.filter((id) => id !== mangaId)
                              : [...(c.manga_ids ?? []), mangaId],
                      }
                    : c,
            ),
        }))

        const result = await toggleCollectionAction(
            collectionId,
            mangaId,
            isInCollection,
        )

        if (result.error) {
            set({ collections: previous })
        }

        return result
    },

    removeCollection: async (collectionId: string) => {
        const previous = get().collections

        set((state) => ({
            collections: state.collections.filter((c) => c.id !== collectionId),
        }))

        const result = await removeCollection(collectionId)

        if (result.error) {
            set((state) => ({
                collections: previous ?? state.collections,
            }))
        }

        return result
    },

    reorderCollections: async (reordered: Collection[]) => {
        set({ collections: reordered })
        const payload = reordered.map((col, index) => ({
            id: col.id,
            position: index,
        }))
        await reorderCollectionsAction(payload)
    },
})
