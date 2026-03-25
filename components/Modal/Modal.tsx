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
                "open:animate-in open:fade-in open:zoom-in-95 overflow-hidden bg-transparent p-0 outline-none backdrop:bg-black/50 backdrop:backdrop-blur-sm",
                className,
            )}
            onClick={(e) => e.target === ref.current && onClose()}
        >
            <div className="bg-surface custom-scroll relative max-h-[93dvh] overflow-hidden rounded-xl p-4">
                {!hideCloseButton && (
                    <button
                        onClick={onClose}
                        className="bg-primary absolute top-2 right-2 shrink-0 rounded p-2 text-white/40 hover:bg-white/10 hover:text-white/80"
                    >
                        <X size={16} className="text-white/40" />
                    </button>
                )}
                {children}
            </div>
        </dialog>
    )
}
