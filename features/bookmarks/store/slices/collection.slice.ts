import { createCollection } from "../../actions/create-collection.action"
import { removeCollection } from "../../actions/remove-collection.action"
import { updateCollection } from "../../actions/update-collection.action"
import { reorderCollectionsAction } from "../../actions/reorder-collection.action"

import { Collection } from "@/lib/supabase/type"

import { StoreSet } from "../types"

export const collectionSlice = (set: StoreSet) => ({
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
        const previous = undefined

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

    removeCollection: async (collectionId: string) => {
        const previous = undefined

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
