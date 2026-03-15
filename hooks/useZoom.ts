import { useState, useRef, useCallback, useEffect } from "react"

export const useZoom = () => {
    const [scale, setScale] = useState(1)
    const [origin, setOrigin] = useState({ x: 50, y: 50 })
    const containerRef = useRef<HTMLDivElement>(null)

    // Ctrl+scroll to zoom in/out — preserves quality, no scale cap issues
    const onWheel = useCallback((e: WheelEvent) => {
        if (!e.ctrlKey || !containerRef.current) return
        e.preventDefault()

        const rect = containerRef.current.getBoundingClientRect()
        setOrigin({
            x: ((e.clientX - rect.left) / rect.width) * 100,
            y: ((e.clientY - rect.top) / rect.height) * 100,
        })

        setScale((prev) => {
            const delta = e.deltaY > 0 ? -0.15 : 0.15
            return Math.min(Math.max(prev + delta, 1), 3) // clamp 1x - 3x
        })
    }, [])

    const onDoubleClick = useCallback(() => {
        setScale(1)
        setOrigin({ x: 50, y: 50 })
    }, [])

    useEffect(() => {
        const el = containerRef.current
        if (!el) return
        el.addEventListener("wheel", onWheel, { passive: false })
        return () => el.removeEventListener("wheel", onWheel)
    }, [onWheel])

    const style = {
        transform: `scale(${scale})`,
        transformOrigin: `${origin.x}% ${origin.y}%`,
        transition: scale === 1 ? "transform 0.25s ease" : "none", // snap back animated, zoom instant
        willChange: "transform" as const,
    }

    return { scale, containerRef, style, onDoubleClick }
}
