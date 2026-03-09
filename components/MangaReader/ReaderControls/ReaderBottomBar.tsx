import { NavButton } from "@/components/NavButton/NavButton"
import { Scrubber } from "../Scrubber"
import { useReader } from "../ReaderContext"

import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react"

interface ReaderBottomBarProps {
    hudClass: string
    sidebarOpen: boolean
}

export const ReaderBottomBar = ({
    hudClass,
    sidebarOpen,
}: ReaderBottomBarProps) => {
    const { prev, next, index, totalPages } = useReader()
    return (
        <div
            className={`${hudClass} ${sidebarOpen ? "bg-primary" : "bg-surface"} absolute bottom-0 w-full shadow-[0px_-1px_4px_black] backdrop-blur-sm transition-colors duration-300`}
        >
            <Scrubber />
            <div className="flex items-center justify-center border-t border-white/5 px-4 py-2">
                <div className="flex items-center gap-1">
                    <NavButton onClick={prev} disabled={index === 0}>
                        <ChevronLeft className="w-4" />
                        <span>Prev</span>
                    </NavButton>
                    <NavButton>
                        <span>Chapters</span>
                        <ChevronDown className="ml-1 w-4" />
                    </NavButton>
                    <NavButton
                        onClick={next}
                        disabled={index >= totalPages - 1}
                    >
                        <span>Next</span>
                        <ChevronRight className="w-4" />
                    </NavButton>
                </div>
            </div>
        </div>
    )
}
