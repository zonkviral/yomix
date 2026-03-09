import { List } from "@/components/List/List"

interface ChapterSidebarProps {
    chapters: string[]
    sidebarOpen: boolean
}

export const ChapterSidebar = ({
    chapters,
    sidebarOpen,
}: ChapterSidebarProps) => (
    <div
        className={`bg-primary absolute top-(--reader-top-h) bottom-(--reader-bottom-h) z-3 w-fit overflow-y-auto shadow-[4px_0px_2px_-2px_black] transition-transform duration-300 ease-in-out [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
    >
        <List
            className="py-1"
            list={chapters}
            renderItem={(data, i) => (
                <a href={`#${i + 1}`} className="flex px-2 py-3 text-sm">
                    <span>{data}</span>
                </a>
            )}
            listClassName="hover:bg-neutral-800"
        />
    </div>
)
