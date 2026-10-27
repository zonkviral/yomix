"use client"

import { useEffect, useRef, useState } from "react"

import { useBookmark } from "../../hooks/useBookmark"

import * as DropdownMenu from "@radix-ui/react-dropdown-menu"

import { Manga } from "@/lib/supabase/type"

import { cn } from "@/utils/cn"

import { Bookmark, ChevronDown } from "lucide-react"

const PARTICLE_COLORS = ["#fb7185", "#f43f5e", "#fda4af", "#fbbf24", "#fb923c"]
const ANGLES = [0, 45, 90, 135, 180, 225, 270, 315]

interface BookmarkButtonProps {
    mangaId: string
    manga?: Manga
}

export const BookmarkButton = ({ mangaId, manga }: BookmarkButtonProps) => {
    const [hasMounted, setHasMounted] = useState(false)
    const { isBookmarked, isToggling, toggle } = useBookmark(mangaId, manga)
    const btnRef = useRef<HTMLButtonElement>(null)
    const heartRef = useRef<SVGSVGElement>(null)

    useEffect(() => {
        setHasMounted(true)
    }, [])
    const handleClick = async () => {
        if (isToggling) return

        const heart = heartRef.current
        if (heart) {
            heart.style.animation = "none"
            void heart.getBoundingClientRect()
            heart.style.animation = "heartPop 0.45s cubic-bezier(.36,.07,.19,.97) forwards"
        }

        if (!isBookmarked && btnRef.current) {
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
            <div
                className={cn(
                    "flex items-stretch rounded-xl bg-neutral-900",
                    "shadow-md shadow-neutral-900/50 transition",
                    "disabled:cursor-not-allowed disabled:opacity-50",
                )}
            >
                <button
                    ref={btnRef}
                    onClick={handleClick}
                    disabled={isToggling || !hasMounted}
                    className="rounded-l-xl px-3 hover:bg-neutral-800 hover:shadow-lg hover:shadow-neutral-900/70"
                >
                    <Bookmark
                        ref={heartRef}
                        className={cn("all inline w-6 stroke-rose-600 stroke-1 transition", {
                            "fill-rose-500": isBookmarked,
                        })}
                    />
                    <span className="pl-2">{isBookmarked ? "В закладках" : "В закладки"}</span>
                </button>
                <span className="h-full w-px bg-zinc-800/80" />
                <DropdownMenu.Root modal={false}>
                    <DropdownMenu.Trigger
                        className={cn(
                            "group relative rounded-r-xl px-2 transition",
                            "hover:bg-neutral-800",
                        )}
                    >
                        <ChevronDown className="w-5 text-white/50 transition-all group-data-[state=open]:rotate-180" />
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content className="z-50 rounded bg-neutral-800 p-2 text-sm text-white shadow-md">
                        <DropdownMenu.Item className="cursor-pointer rounded px-2 py-1 hover:bg-neutral-700">
                            Читаю
                        </DropdownMenu.Item>
                        <DropdownMenu.Item className="cursor-pointer rounded px-2 py-1 hover:bg-neutral-700">
                            Прочитано
                        </DropdownMenu.Item>
                        <DropdownMenu.Item className="cursor-pointer rounded px-2 py-1 hover:bg-neutral-700">
                            Запланировано
                        </DropdownMenu.Item>
                    </DropdownMenu.Content>
                </DropdownMenu.Root>
            </div>
        </>
    )
}
