"use client"

import { useEffect, useRef } from "react"

import { List } from "@/components/List/List"
import { useReader } from "../ReaderContext"
import { useReaderUI } from "./ReaderUIContext"

export const ChapterSidebar = () => {
    const { chapterList, currentChapterId, switchChapter, chapterLoading } =
        useReader()
    const { sidebarOpen } = useReaderUI()
    const activeRef = useRef<HTMLButtonElement>(null)

    useEffect(() => {
        if (sidebarOpen) {
            setTimeout(() => {
                activeRef.current?.scrollIntoView({
                    block: "center",
                    behavior: "smooth",
                })
            }, 350)
        }
    }, [sidebarOpen])

    return (
        <div
            className={`bg-primary absolute top-(--reader-top-h) bottom-(--reader-bottom-h) z-3 w-fit overflow-y-auto shadow-[4px_0px_2px_-2px_black] transition-transform duration-300 ease-in-out [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
                sidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
        >
            <List
                className="py-1"
                items={chapterList}
                renderItem={(data) => {
                    const isActive = data.id === currentChapterId
                    return (
                        <button
                            ref={isActive ? activeRef : null}
                            type="button"
                            disabled={chapterLoading}
                            onClick={() => switchChapter(data.id)}
                            className={`flex w-full px-4 py-3 text-left text-sm transition-colors duration-150 disabled:opacity-50 ${
                                isActive
                                    ? "bg-white/10 text-white"
                                    : "text-white/60 hover:bg-neutral-800 hover:text-white"
                            }`}
                        >
                            {`Том ${data.attributes.volume} - Глава ${data.attributes.chapter}`}
                        </button>
                    )
                }}
            />
        </div>
    )
}
