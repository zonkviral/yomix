import { cn } from "@/utils/cn"
import { useEffect, useRef, useState } from "react"

interface CollectionButtonProps {
    isActive: boolean
    icon?: React.ReactNode
    label: string
    count?: number
    onClick: () => void
}

export const CollectionButton = ({
    isActive,
    icon,
    label,
    count,
    onClick,
}: CollectionButtonProps) => {
    const [isTruncated, setIsTruncated] = useState(false)
    const textRef = useRef<HTMLHeadingElement>(null)

    useEffect(() => {
        const element = textRef.current
        if (!element) return

        const checkOverflow = () => {
            setIsTruncated(element.scrollWidth > element.clientWidth)
        }
        checkOverflow()

        const resizeObserver = new ResizeObserver(checkOverflow)
        resizeObserver.observe(element)

        return () => resizeObserver.disconnect()
    }, [label])
    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                "group/col flex w-full min-w-0 flex-1 items-center gap-2 rounded p-1 text-left text-base transition-colors",
                isActive ? "text-white" : "text-white/70 hover:text-white",
            )}
        >
            {icon}
            <div className="group relative flex min-w-0 flex-1 items-center gap-2">
                <h4
                    ref={textRef}
                    className={cn(
                        "line-clamp-1 flex-1 truncate font-semibold",
                        "group-hover/col:underline",
                        count == undefined && "line-clamp-1",
                        isActive && "underline",
                    )}
                >
                    {label}
                </h4>
                {isTruncated && (
                    <span className="dynamic-layer pointer-events-none absolute bottom-full left-6 z-50 mb-1 max-w-xs scale-95 rounded bg-neutral-950 px-2 py-1 text-xs wrap-break-word text-white opacity-0 shadow-xl transition-all group-focus-within:scale-100 group-focus-within:opacity-100 group-hover:scale-100 group-hover:opacity-100">
                        {label}
                    </span>
                )}
            </div>
            {count !== undefined && (
                <span className="ml-auto shrink-0 text-sm text-white/70">
                    {count}
                </span>
            )}
        </button>
    )
}
