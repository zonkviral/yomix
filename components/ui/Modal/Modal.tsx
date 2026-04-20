"use client"

import { useEffect, useRef } from "react"
import { X } from "lucide-react"
import { cn } from "@/utils/cn"

interface Props {
    isOpen: boolean
    onClose: () => void
    children: React.ReactNode
    className?: string
    hideCloseButton?: boolean
}

export const Modal = ({
    isOpen,
    onClose,
    children,
    className,
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

    return (
        <dialog
            ref={ref}
            className={cn(
                "open:animate-in open:fade-in open:zoom-in-95 mt-0 items-center justify-center overflow-hidden bg-transparent outline-none backdrop:bg-black/50 backdrop:backdrop-blur-sm sm:my-0 md:my-px md:max-h-screen lg:mt-8",
                className,
            )}
            onClick={(e) => e.target === ref.current && onClose()}
        >
            <div className="bg-surface relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl p-4 sm:max-h-[85vh] md:max-h-screen">
                {!hideCloseButton && (
                    <button
                        onClick={onClose}
                        className="bg-primary absolute top-2 right-2 z-10 shrink-0 rounded px-3 py-2 text-white/40 hover:bg-white/10 hover:text-white/80"
                    >
                        <X className="w-4 text-white/40" />
                    </button>
                )}
                {children}
            </div>
        </dialog>
    )
}
