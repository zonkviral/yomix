"use client"

import { useRef, useState } from "react"

import Image from "next/image"

import { Camera } from "lucide-react"

import { uploadBanner } from "../actions/upload-banner.action"

interface BannerProps {
    bannerUrl?: string | null
    isOwnProfile: boolean
}

export const ProfileBanner = ({ bannerUrl, isOwnProfile }: BannerProps) => {
    const inputRef = useRef<HTMLInputElement>(null)
    const [preview, setPreview] = useState<string | null>(null)
    const [uploading, setUploading] = useState(false)

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setPreview(URL.createObjectURL(file))
        setUploading(true)

        const formData = new FormData()
        formData.append("banner", file)

        const result = await uploadBanner(formData)
        if (result.error) {
            console.error(result.error)
            setPreview(null)
        }

        setUploading(false)
    }

    const src = preview ?? bannerUrl

    return (
        <div className="group absolute inset-0">
            {src ? (
                <Image className="object-cover" alt="banner" fill src={src} />
            ) : (
                <div className="absolute inset-0 bg-linear-120 from-[#0f0d1a] to-[#0b0c15]" />
            )}

            <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />

            {isOwnProfile && (
                <>
                    <button
                        onClick={() => inputRef.current?.click()}
                        disabled={uploading}
                        className="absolute top-3 right-3 z-10 flex items-center gap-1.5 rounded-sm border border-white/10 bg-black/40 px-2.5 py-1.5 text-xs text-white/70 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100 hover:bg-black/60 disabled:opacity-50"
                    >
                        <Camera className="w-3.5" />
                        {uploading ? "Uploading..." : "Change banner"}
                    </button>
                    <input
                        ref={inputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                </>
            )}
        </div>
    )
}
