/* eslint-disable @next/next/no-img-element */
"use client"
import { useRef, useState, memo, useCallback } from "react"
import { useReader } from "./ReaderContext"

interface Props {
    pagesThumbs: string[]
}

// Maximum number of dashes shown regardless of page count.
// Above this, each dash represents multiple pages.
const MAX_DASHES = 60

function ScrubberBase({ pagesThumbs }: Props) {
    const { index, setIndex, totalPages } = useReader()
    const trackRef = useRef<HTMLDivElement>(null)
    const [hoverDash, setHoverDash] = useState<number | null>(null)
    const frame = useRef<number>(0)

    const dashCount = Math.min(totalPages, MAX_DASHES)
    // How many real pages each dash represents (>=1)
    const pagesPerDash = totalPages / dashCount

    // Convert a dash index to the page index it represents
    const dashToPage = (d: number) =>
        Math.min(Math.round(d * pagesPerDash), totalPages - 1)

    // Which dash the current page falls on
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

    // Page number shown in the hover thumbnail
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
                            className="h-1 flex-1 rounded-sm bg-rose-600 transition-all duration-150"
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

                {/* Hover thumbnail */}
                {hoverDash !== null &&
                    hoverPage !== null &&
                    pagesThumbs[hoverPage] && (
                        <div
                            className="pointer-events-none absolute bottom-10 z-50 overflow-hidden rounded border border-white/20 bg-black shadow-2xl"
                            style={{
                                left: `${(hoverDash / dashCount) * 100}%`,
                                transform: "translateX(-50%)",
                                width: 72,
                                height: 100,
                            }}
                        >
                            <img
                                src={pagesThumbs[hoverPage]}
                                alt=""
                                className="h-full w-full object-cover"
                            />
                            <div className="absolute bottom-0 w-full bg-black/70 py-0.5 text-center font-mono text-[9px] text-white/80">
                                {hoverPage + 1}
                            </div>
                        </div>
                    )}
            </div>

            <div className="mt-0.5 flex justify-between font-mono text-[10px] text-white/30">
                <span>1</span>
                <span className="text-white/60">
                    {index + 2} / {totalPages}
                </span>
                <span>{totalPages}</span>
            </div>
        </div>
    )
}

export const Scrubber = memo(ScrubberBase)
