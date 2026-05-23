"use client"

import { useEffect, useRef } from "react"

import { useReaderConfig, useReaderPlayback } from "./ReaderContext"

import { FILTER_MAP } from "../constants"

export const WebtoonReader = ({ pages }: { pages: string[] }) => {
    const { filter } = useReaderConfig()
    const { pageIndex, setIndex } = useReaderPlayback()
    const imgRefs = useRef<(HTMLDivElement | null)[]>([])
    const observerRef = useRef<IntersectionObserver | null>(null)
    const isScrollingToRef = useRef(false)

    useEffect(() => {
        const el = imgRefs.current[pageIndex]
        if (!el) return
        isScrollingToRef.current = true
        el.scrollIntoView({ behavior: "smooth", block: "start" })
        setTimeout(() => {
            isScrollingToRef.current = false
        }, 800)
    }, [pageIndex])

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
        <div className="h-full w-full overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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
                            style={{ filter: FILTER_MAP[filter] }}
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
