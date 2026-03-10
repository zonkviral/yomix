"use client"

import { HoverZone } from "@/components/HoverZone/HoverZone"
import { ChapterSidebar } from "./ChapterSidebar"
import { ReaderTopBar } from "./ReaderTopBar"
import { ReaderBottomBar } from "./ReaderBottomBar"
import { ReaderUIProvider, useReaderUI } from "./ReaderUIContext"

const ReaderControlsInner = () => {
    const { show, hide } = useReaderUI()

    return (
        <>
            <HoverZone
                className="absolute top-0 z-1 h-15 w-full"
                onShow={show}
                onHide={hide}
            >
                <ReaderTopBar />
            </HoverZone>
            <ChapterSidebar />
            <HoverZone
                className="absolute bottom-0 z-1 h-25 w-full"
                onShow={show}
                onHide={hide}
            >
                <ReaderBottomBar />
            </HoverZone>
        </>
    )
}

// Wrap in provider so all children can access UI state
export const ReaderControls = () => (
    <ReaderUIProvider>
        <ReaderControlsInner />
    </ReaderUIProvider>
)
