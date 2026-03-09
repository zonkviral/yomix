import { IconButton } from "@/components/IconButton/IconButton"
import { useReader } from "../ReaderContext"
import { SettingsModal } from "./SettingsModal"

import { ChevronLeft, Maximize2, Menu, Settings } from "lucide-react"

interface ReaderTopBar {
    sidebarOpen: boolean
    onToggleSidebar: () => void
    hudClass: string
    settingsOpen: boolean
    onCloseSettings: () => void
    onToggleSettings: () => void
}

export const ReaderTopBar = ({
    sidebarOpen,
    onToggleSidebar,
    hudClass,
    onCloseSettings,
    settingsOpen,
    onToggleSettings,
}: ReaderTopBar) => {
    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen()
        } else {
            document.exitFullscreen()
        }
    }
    const { index, totalPages } = useReader()
    return (
        <div
            className={`${hudClass} ${sidebarOpen ? "bg-primary" : "bg-surface"} absolute top-0 grid w-full grid-cols-3 items-center px-4 py-2 shadow-[0px_1px_4px_black]`}
        >
            <div>
                <IconButton
                    active={sidebarOpen}
                    onClick={onToggleSidebar}
                    className="relative h-8 w-8"
                >
                    <span
                        className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
                            sidebarOpen
                                ? "scale-75 rotate-90 opacity-0"
                                : "scale-100 rotate-0 opacity-100"
                        }`}
                    >
                        <Menu className="w-6" />
                    </span>
                    <span
                        className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
                            sidebarOpen
                                ? "scale-100 rotate-0 opacity-100"
                                : "scale-75 -rotate-90 opacity-0"
                        }`}
                    >
                        <ChevronLeft className="w-6" />
                    </span>
                </IconButton>
            </div>
            <div className="flex justify-center">
                <span className="truncate text-sm text-white/60">
                    Title - Chapter
                </span>
            </div>
            <div className="flex items-center justify-end gap-1">
                <span className="mr-2 font-mono text-sm text-white/60">
                    Page {index + 1} of {totalPages}
                </span>
                <IconButton onClick={onToggleSettings}>
                    <Settings
                        className={`w-6 transition-transform duration-300 ${settingsOpen ? "rotate-180" : "rotate-0"}`}
                    />
                </IconButton>
                <IconButton onClick={toggleFullscreen}>
                    <Maximize2 className="w-6" />
                </IconButton>
            </div>
            {settingsOpen && (
                <div className="bg-primary absolute top-full right-0 z-20 w-70 rounded-lg px-3 py-4 shadow-[0px_4px_24px_black]">
                    <SettingsModal onClose={onCloseSettings} />
                </div>
            )}
        </div>
    )
}
