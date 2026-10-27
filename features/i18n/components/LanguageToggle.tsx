"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"

import { updateSystemLang } from "../actions/system-lang.action"

import { cn } from "@/utils/cn"

const LANGS = [
    { value: "ru", label: "RU" },
    { value: "en", label: "EN" },
]

export const LanguageToggle = ({ current }: { current: string }) => {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()

    const change = (lang: string) => {
        if (lang === current) return
        startTransition(async () => {
            await updateSystemLang(lang)
            router.refresh()
        })
    }

    return (
        <div className={cn("flex gap-1", isPending && "opacity-50")}>
            {LANGS.map(({ value, label }) => (
                <button
                    key={value}
                    type="button"
                    disabled={isPending}
                    onClick={() => change(value)}
                    className={cn(
                        "rounded px-2 py-1 text-sm transition",
                        current === value
                            ? "bg-rose-900 text-white"
                            : "text-white/50 hover:text-white",
                    )}
                >
                    {label}
                </button>
            ))}
        </div>
    )
}
