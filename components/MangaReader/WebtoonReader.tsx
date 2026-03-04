"use client"

import { useEffect, useRef } from "react"
import { useReader } from "./ReaderContext"

export const WebtoonReader = ({ pages }: { pages: string[] }) => {
    const { index, setIndex } = useReader()
    const imgRefs = useRef<(HTMLDivElement | null)[]>([])
    const observerRef = useRef<IntersectionObserver | null>(null)
    const isScrollingToRef = useRef(false)

    // External index change (mode switch) → scroll to position
    useEffect(() => {
        const el = imgRefs.current[index]
        if (!el) return
        isScrollingToRef.current = true
        el.scrollIntoView({ behavior: "smooth", block: "start" })
        setTimeout(() => {
            isScrollingToRef.current = false
        }, 800)
    }, [index])

    // Track visible page → report to context
    useEffect(() => {
        observerRef.current?.disconnect()

        observerRef.current = new IntersectionObserver(
            (entries) => {
                if (isScrollingToRef.current) return
                const visible = entries
                    .filter((e) => e.isIntersecting)
                    .sort(
                        (a, b) => b.intersectionRatio - a.intersectionRatio,
                    )[0]
                if (!visible) return
                const idx = Number(visible.target.getAttribute("data-index"))
                if (!isNaN(idx)) setIndex(idx)
            },
            { threshold: 0.5 },
        )

        imgRefs.current.forEach((el) => {
            if (el) observerRef.current?.observe(el)
        })

        return () => observerRef.current?.disconnect()
    }, [pages, setIndex])

    return (
        <div className="h-full w-full overflow-y-auto bg-black">
            <div className="mx-auto flex max-w-2xl flex-col">
                {pages.map((url, i) => (
                    <div
                        key={i}
                        ref={(el) => {
                            imgRefs.current[i] = el
                        }}
                        data-index={i}
                    >
                        <img
                            src={url}
                            alt={`Page ${i + 1}`}
                            className="w-full"
                            loading="lazy"
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}
