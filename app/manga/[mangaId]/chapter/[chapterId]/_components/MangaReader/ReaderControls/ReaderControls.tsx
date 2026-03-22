"use client"

import { HoverTrigger } from "@/components/HoverTrigger/HoverTrigger"
import { ChapterSidebar } from "./ChapterSidebar"
import { ReaderTopBar } from "./ReaderTopBar"
import { ReaderBottomBar } from "./ReaderBottomBar"
import { ReaderUIProvider, useReaderUI } from "./ReaderUIContext"

const ReaderControlsInner = () => {
    const { show, hide } = useReaderUI()

    return (
        <>
            <HoverTrigger
                className="absolute top-0 z-1 h-15 w-full"
                onShow={show}
                onHide={hide}
            >
                <ReaderTopBar />
            </HoverTrigger>
            <ChapterSidebar />
            <HoverTrigger
                className="absolute bottom-0 z-1 h-25 w-full"
                onShow={show}
                onHide={hide}
            >
                <ReaderBottomBar />
            </HoverTrigger>
        </>
    )
}

// Wrap in provider so all children can access UI state
export const ReaderControls = () => (
    <ReaderUIProvider>
        <ReaderControlsInner />
    </ReaderUIProvider>
)
