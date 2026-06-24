"use client"

import { useEffect, useRef } from "react"

import { createPortal } from "react-dom"

import { cn } from "@/utils/cn"

import { X } from "lucide-react"

interface Props {
    isOpen: boolean
    onClose: () => void
    children: React.ReactNode
    className?: string
    contentClassName?: string
    hideCloseButton?: boolean
}

export const Modal = ({
    isOpen,
    onClose,
    children,
    className,
    contentClassName,
    hideCloseButton,
}: Props) => {
    const ref = useRef<HTMLDialogElement>(null)

    useEffect(() => {
        const dialog = ref.current
        if (!dialog) return
        if (isOpen) dialog.showModal()
        else dialog.close()
    }, [isOpen])

    useEffect(() => {
        const dialog = ref.current
        if (!dialog) return
        dialog.addEventListener("close", onClose)
        return () => dialog.removeEventListener("close", onClose)
    }, [onClose])

    if (!isOpen) return null

    return createPortal(
        <dialog
            ref={ref}
            className={cn(
                "open:animate-in open:fade-in open:zoom-in-95 m-auto min-w-2xs items-center justify-center overflow-hidden bg-transparent outline-none backdrop:bg-black/50 backdrop:backdrop-blur-sm md:max-h-screen",
                className,
            )}
            onClick={(e) => e.target === ref.current && onClose()}
        >
            <div
                className={cn(
                    "bg-surface relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl p-4 sm:max-h-[85vh] md:max-h-screen",
                    contentClassName,
                )}
            >
                {!hideCloseButton && (
                    <button
                        onClick={onClose}
                        className="absolute top-2 right-2 z-10 shrink-0 rounded px-3 py-2 text-white/40 hover:bg-white/10 hover:text-white/80"
                    >
                        <X className="w-4 text-white/40" />
                    </button>
                )}
                {children}
            </div>
        </dialog>,
        document.body,
    )
}
