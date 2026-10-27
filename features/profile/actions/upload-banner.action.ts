"use server"

import { createClient } from "@/lib/supabase/server"
import { createServiceClient } from "@/lib/supabase/service"

export const uploadBanner = async (formData: FormData) => {
    const supabase = await createClient()
    const supabaseAdmin = createServiceClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()
    if (!user) return { error: "Not authenticated" }

    const file = formData.get("banner") as File
    if (!file) return { error: "No file provided" }

    if (file.size > 5 * 1024 * 1024) return { error: "Max 5MB" }
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
        return { error: "JPG, PNG or WebP only" }
    }

    const ext = file.name.split(".").pop()
    const path = `${user.id}/banner.${ext}`

    await supabaseAdmin.storage
        .from("banners")
        .remove([`${user.id}/banner.jpg`, `${user.id}/banner.png`, `${user.id}/banner.webp`])

    const { error: uploadError } = await supabaseAdmin.storage
        .from("banners")
        .upload(path, file, { upsert: true })

    if (uploadError) return { error: uploadError.message }

    const {
        data: { publicUrl },
    } = supabaseAdmin.storage.from("banners").getPublicUrl(path)

    const { error: updateError } = await supabase
        .from("profiles")
        .update({ banner_url: publicUrl })
        .eq("id", user.id)

    if (updateError) return { error: updateError.message }

    return { success: true, url: publicUrl }
}
