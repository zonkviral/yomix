"use client"

import { ReactNode, useState, useEffect, useRef } from "react"
import { cn } from "@/utils/cn"

interface Props {
    children: ReactNode
    activeIndex?: number
    className?: string
    variant?: "inset" | "fill"
    indicatorClassName?: string
}

export const RadioGroup = ({
    children,
    activeIndex,
    className,
    variant = "inset",
    indicatorClassName = "bg-rose-900",
}: Props) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const [dimensions, setDimensions] = useState({ left: 0, width: 0 })

    useEffect(() => {
        if (activeIndex === undefined || !containerRef.current) return
        const tabs = containerRef.current.querySelectorAll("[data-radio-tab]")
        const activeTab = tabs[activeIndex] as HTMLElement

        if (activeTab) {
            setDimensions({
                left: activeTab.offsetLeft,
                width: activeTab.offsetWidth,
            })
        }
    }, [activeIndex, children])

    return (
        <div
            ref={containerRef}
            className={cn(
                "relative flex w-max items-center rounded-md bg-white/5",
                variant === "fill" && "overflow-hidden",
                className,
            )}
        >
            {activeIndex !== undefined && (
                <span
                    className={cn(
                        "pointer-events-none absolute top-0 bottom-0 transition-all duration-300 ease-in-out",
                        variant === "inset" ? "p-1" : "p-0",
                    )}
                    style={{
                        left: `${dimensions.left}px`,
                        width: `${dimensions.width}px`,
                    }}
                >
                    <span
                        className={cn(
                            "execution-layer block h-full w-full",
                            variant === "inset" ? "rounded" : "rounded-none",
                            indicatorClassName,
                        )}
                    />
                </span>
            )}
            <div className="relative z-10 flex h-full w-full items-center gap-0">
                {children}
            </div>
        </div>
    )
}
