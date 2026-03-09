/* eslint-disable @next/next/no-img-element */
"use client"

import { useRef, useState, memo, useCallback } from "react"

import { useReader } from "./ReaderContext"

const MAX_DASHES = 60

function ScrubberBase() {
    const { index, setIndex, totalPages, pagesThumbs } = useReader()
    const trackRef = useRef<HTMLDivElement>(null)
    const [hoverDash, setHoverDash] = useState<number | null>(null)
    const frame = useRef<number>(0)

    const dashCount = Math.min(totalPages, MAX_DASHES)
    const pagesPerDash = totalPages / dashCount
    const dashToPage = (d: number) =>
        Math.min(Math.round(d * pagesPerDash), totalPages - 1)
    const activeDash = Math.floor(index / pagesPerDash)

    const dashFromEvent = useCallback(
        (e: React.MouseEvent): number | null => {
            if (!trackRef.current) return null
            const rect = trackRef.current.getBoundingClientRect()
            const ratio = Math.max(
                0,
                Math.min(1, (e.clientX - rect.left) / rect.width),
            )
            return Math.floor(ratio * dashCount)
        },
        [dashCount],
    )

    const onMouseMove = useCallback(
        (e: React.MouseEvent) => {
            cancelAnimationFrame(frame.current)
            frame.current = requestAnimationFrame(() => {
                const d = dashFromEvent(e)
                setHoverDash(d)
            })
        },
        [dashFromEvent],
    )

    const onClick = useCallback(
        (e: React.MouseEvent) => {
            const d = dashFromEvent(e)
            if (d !== null) setIndex(dashToPage(d))
        },
        [dashFromEvent, dashToPage, setIndex],
    )

    const hoverPage = hoverDash !== null ? dashToPage(hoverDash) : null

    return (
        <div className="px-4 pt-2 pb-3 select-none">
            <div
                ref={trackRef}
                onClick={onClick}
                onMouseMove={onMouseMove}
                onMouseLeave={() => setHoverDash(null)}
                className="relative flex cursor-pointer items-center gap-px py-2"
            >
                {Array.from({ length: dashCount }, (_, i) => {
                    const filled = i <= activeDash
                    const isHovered = hoverDash !== null && i <= hoverDash
                    return (
                        <div
                            key={i}
                            className="h-1 flex-1 rounded-sm transition-all duration-150"
                            style={{
                                background: filled
                                    ? `linear-gradient(90deg,
                                        hsl(${338 + (i / dashCount) * 60}, 100%, 39%),
                                        hsl(${338 + ((i + 1) / dashCount) * 60}, 100%, 39%)
                                      )`
                                    : isHovered
                                      ? "rgba(255,255,255,0.25)"
                                      : "rgba(255,255,255,0.12)",
                                transform:
                                    isHovered && !filled
                                        ? "scaleY(1.5)"
                                        : filled
                                          ? "scaleY(1.25)"
                                          : "scaleY(1)",
                            }}
                        />
                    )
                })}
                <div
                    className="pointer-events-none absolute bottom-10 z-50 overflow-hidden rounded border border-white/20 bg-black shadow-2xl transition-opacity duration-100"
                    style={{
                        left:
                            hoverDash !== null
                                ? `${(hoverDash / dashCount) * 100}%`
                                : "0%",
                        transform: "translateX(-25%)",
                        width: 72,
                        height: 100,
                        opacity: hoverDash !== null ? 1 : 0,
                        pointerEvents: "none",
                    }}
                >
                    {hoverPage && (
                        <img
                            src={pagesThumbs[hoverPage]}
                            alt=""
                            className="h-full w-full object-cover"
                        />
                    )}
                    <div className="absolute bottom-0 w-full bg-black/70 py-0.5 text-center font-mono text-[9px] text-white/80">
                        {hoverPage !== null ? hoverPage + 1 : ""}
                    </div>
                </div>
            </div>
        </div>
    )
}

export const Scrubber = memo(ScrubberBase)
