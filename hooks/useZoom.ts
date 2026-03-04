import { useState, useRef, useCallback, useMemo } from "react"

export function useZoom() {
    const [zoomed, setZoomed] = useState(false)
    const [origin, setOrigin] = useState({ x: 50, y: 50 })
    const containerRef = useRef<HTMLDivElement>(null)

    const toggle = useCallback(
        (e: React.MouseEvent) => {
            if (!e.ctrlKey || !containerRef.current) return
            e.preventDefault()

            if (!zoomed) {
                const rect = containerRef.current.getBoundingClientRect()
                setOrigin({
                    x: ((e.clientX - rect.left) / rect.width) * 100,
                    y: ((e.clientY - rect.top) / rect.height) * 100,
                })
            }

            setZoomed((p) => !p)
        },
        [zoomed],
    )

    // Memoized so the reading area div never sees a changed style object
    // on re-renders unrelated to zoom state
    const style = useMemo(
        () => ({
            transform: zoomed ? "scale(2)" : "scale(1)",
            transformOrigin: `${origin.x}% ${origin.y}%`,
            transition: "transform 0.25s ease",
            willChange: "transform" as const,
        }),
        [zoomed, origin],
    )

    return { zoomed, toggle, containerRef, style }
}
