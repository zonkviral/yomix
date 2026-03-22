"use client"

import { useEffect } from "react"
import { useReader } from "./ReaderContext"

import { FILTER_MAP } from "./constants"

export const SingleReader = ({ pages }: { pages: string[] }) => {
    const { index, next, prev, filter } = useReader()

    // Preload next 2 pages
    useEffect(() => {
        for (let i = 1; i <= 2; i++) {
            const url = pages[index + i]
            if (url) new Image().src = url
        }
    }, [index, pages])

    return (
        <>
            <button
                className="absolute top-0 left-0 z-10 h-full w-1/3 cursor-pointer"
                onClick={prev}
            />
            <button
                className="absolute top-0 right-0 z-10 h-full w-1/3 cursor-pointer"
                onClick={next}
            />
            <img
                style={{ filter: FILTER_MAP[filter] }}
                key={index}
                src={pages[index]}
                alt={`Page ${index + 1}`}
                className="h-full w-fit object-contain shadow-[1px_0px_11px_3px_black]"
            />
        </>
    )
}
