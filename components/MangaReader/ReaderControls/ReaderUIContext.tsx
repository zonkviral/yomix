"use client"

import {
    createContext,
    useContext,
    useState,
    ReactNode,
    useCallback,
} from "react"

import { useHudVisibility } from "@/hooks/useHudVisibility"
import { useModal } from "@/hooks/useModal"

interface ReaderUIContextValue {
    // hud
    hudClass: string
    show: () => void
    hide: () => void
    // sidebar
    sidebarOpen: boolean
    toggleSidebar: () => void
    // settings
    settingsOpen: boolean
    toggleSettings: () => void
    closeSettings: () => void
    // chapter select
    selectOpen: boolean
    setSelectOpen: (v: boolean) => void
}

const ReaderUIContext = createContext<ReaderUIContextValue | null>(null)

export const useReaderUI = () => {
    const ctx = useContext(ReaderUIContext)
    if (!ctx) throw new Error("ReaderUIContext missing")
    return ctx
}

export const ReaderUIProvider = ({ children }: { children: ReactNode }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [selectOpen, setSelectOpen] = useState(false)
    const {
        isOpen: settingsOpen,
        toggle: toggleSettings,
        close: closeSettings,
    } = useModal()
    const { visible, show, hide } = useHudVisibility()

    const toggleSidebar = useCallback(() => setSidebarOpen((o) => !o), [])

    const hudClass = `transition-opacity duration-200 ${
        visible || sidebarOpen || settingsOpen || selectOpen
            ? "opacity-100"
            : "opacity-0 pointer-events-none"
    }`

    return (
        <ReaderUIContext.Provider
            value={{
                hudClass,
                show,
                hide,
                sidebarOpen,
                toggleSidebar,
                settingsOpen,
                toggleSettings,
                closeSettings,
                selectOpen,
                setSelectOpen,
            }}
        >
            {children}
        </ReaderUIContext.Provider>
    )
}
