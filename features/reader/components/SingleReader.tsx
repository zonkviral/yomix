"use client"

import { useEffect } from "react"
import { useReaderConfig, useReaderPlayback } from "./ReaderContext"

import { FILTER_MAP } from "../constants"

export const SingleReader = ({ pages }: { pages: string[] }) => {
    const { filter } = useReaderConfig()
    const { pageIndex, next, prev } = useReaderPlayback()

    useEffect(() => {
        for (let i = 1; i <= 2; i++) {
            const url = pages[pageIndex + i]
            if (url) new Image().src = url
        }
    }, [pageIndex, pages])

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
                key={pageIndex}
                src={pages[pageIndex]}
                alt={`Page ${pageIndex + 1}`}
                className="h-full w-fit object-contain shadow-[1px_0px_11px_3px_black]"
            />
        </>
    )
}
