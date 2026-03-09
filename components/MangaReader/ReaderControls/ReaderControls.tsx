"use client"

import { useState } from "react"

import { HoverZone } from "@/components/HoverZone/HoverZone"
import { ChapterSidebar } from "./ChapterSidebar"
import { ReaderTopBar } from "./ReaderTopBar"
import { ReaderBottomBar } from "./ReaderBottomBar"

import { useHudVisibility } from "@/hooks/useHudVisibility"
import { useModal } from "@/hooks/useModal"

export const ReaderControls = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const { isOpen, close, toggle } = useModal()

    const chapters = Array(30).fill("Том 1 Глава 1 - Гении против")

    const { visible, show, hide } = useHudVisibility()

    const hudClass = `transition-opacity duration-200 ${
        visible || sidebarOpen || isOpen
            ? "opacity-100"
            : "opacity-0 pointer-events-none"
    }`

    return (
        <>
            <HoverZone
                className="absolute top-0 z-1 h-15 w-full"
                onShow={show}
                onHide={hide}
            >
                <ReaderTopBar
                    hudClass={hudClass}
                    sidebarOpen={sidebarOpen}
                    onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
                    settingsOpen={isOpen}
                    onCloseSettings={close}
                    onToggleSettings={toggle}
                />
            </HoverZone>
            <ChapterSidebar sidebarOpen={sidebarOpen} chapters={chapters} />
            <HoverZone
                className="absolute bottom-0 z-1 h-25 w-full"
                onShow={show}
                onHide={hide}
            >
                <ReaderBottomBar
                    hudClass={hudClass}
                    sidebarOpen={sidebarOpen}
                />
            </HoverZone>
        </>
    )
}
