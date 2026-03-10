import { NavButton } from "@/components/NavButton/NavButton"
import { Scrubber } from "../Scrubber"
import { useReaderUI } from "./ReaderUIContext"
import { useChapterNavigation } from "@/hooks/useChapterNavigation"
import { ChapterSelect } from "./ChapterSelect"
import { ChevronLeft, ChevronRight } from "lucide-react"

export const ReaderBottomBar = () => {
    const { hudClass, sidebarOpen } = useReaderUI()
    const { goNext, goPrev, chapterLoading } = useChapterNavigation()

    return (
        <div
            className={`${hudClass} ${sidebarOpen ? "bg-primary" : "bg-surface"} absolute bottom-0 w-full shadow-[0px_-1px_4px_black] backdrop-blur-sm transition-colors duration-300`}
        >
            <Scrubber />
            <div className="flex items-center justify-center border-t border-white/5 px-4 py-2">
                <div className="flex items-center gap-1">
                    <NavButton
                        onClick={goPrev ?? undefined}
                        disabled={!goPrev || chapterLoading}
                    >
                        <ChevronLeft className="w-4" />
                        <span>Prev</span>
                    </NavButton>
                    <ChapterSelect />
                    <NavButton
                        onClick={goNext ?? undefined}
                        disabled={!goNext || chapterLoading}
                    >
                        <span>Next</span>
                        <ChevronRight className="w-4" />
                    </NavButton>
                </div>
            </div>
        </div>
    )
}
