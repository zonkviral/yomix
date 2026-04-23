"use client"
import { useRef } from "react"

import { useBookmark } from "../../hooks/useBookmark"

import { MangaSource } from "@/lib/supabase/type"

import { Heart } from "lucide-react"

const PARTICLE_COLORS = ["#fb7185", "#f43f5e", "#fda4af", "#fbbf24", "#fb923c"]
const ANGLES = [0, 45, 90, 135, 180, 225, 270, 315]

interface BookmarkButtonProps {
    mangaId: string
    isBookmarked: boolean
    manga?: MangaSource
}

export const BookmarkButton = ({
    mangaId,
    isBookmarked,
    manga,
}: BookmarkButtonProps) => {
    const {
        isBookmarked: bookmarked,
        toggle,
        loading,
        hasMounted,
    } = useBookmark(mangaId, isBookmarked, manga)
    const btnRef = useRef<HTMLButtonElement>(null)
    const heartRef = useRef<SVGSVGElement>(null)

    const handleClick = async () => {
        if (loading) return

        const heart = heartRef.current
        if (heart) {
            heart.style.animation = "none"
            void heart.getBoundingClientRect()
            heart.style.animation =
                "heartPop 0.45s cubic-bezier(.36,.07,.19,.97) forwards"
        }

        if (!bookmarked && btnRef.current) {
            ANGLES.forEach((angle, i) => {
                const span = document.createElement("span")
                span.className =
                    "absolute left-1/2 top-1/2 h-1.5 w-1.5 rounded-full pointer-events-none"
                const rad = (angle * Math.PI) / 180
                const dist = 28
                span.style.cssText = `
                    background: ${PARTICLE_COLORS[i % PARTICLE_COLORS.length]};
                    margin-left: -3px;
                    margin-top: -3px;
                    --tx: ${Math.cos(rad) * dist}px;
                    --ty: ${Math.sin(rad) * dist}px;
                    animation: particleFly 0.6s ease-out ${i * 20}ms forwards;
                `
                btnRef.current!.appendChild(span)
                span.addEventListener("animationend", () => span.remove(), {
                    once: true,
                })
            })
        }

        try {
            await toggle()
        } catch (error) {
            console.error("Failed to toggle bookmark:", error)
        }
    }

    return (
        <>
            {!hasMounted && (
                <div className="w-10 animate-pulse rounded bg-gray-700 px-2 py-1" />
            )}
            {hasMounted && (
                <button
                    ref={btnRef}
                    onClick={handleClick}
                    disabled={loading || !hasMounted}
                    className="relative cursor-pointer rounded bg-gray-700 px-2 py-1 shadow-md shadow-gray-900/50 transition hover:bg-gray-600 hover:shadow-lg hover:shadow-gray-900/70 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <Heart
                        ref={heartRef}
                        className={`all inline w-6 stroke-rose-600 stroke-1 transition ${bookmarked ? "fill-rose-500" : ""}`}
                    />
                </button>
            )}
        </>
    )
}
