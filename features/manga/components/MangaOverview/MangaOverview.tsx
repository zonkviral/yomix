import { cn } from "@/utils/cn"

import { DetailsTable } from "@/components/ui/DetailsTable/DetailsTable"
import { List } from "@/components/ui/List/List"
import { SectionCard } from "@/components/ui/SectionCard/SectionCard"

import { Circle } from "lucide-react"

interface MangaOverviewProps {
    description: string
    tableData: {
        label: string
        value: string | number | React.ReactNode[] | null
    }[]
    // lastChapters?: any[]
}

export const MangaOverview = ({
    description,
    tableData,
    // lastChapters,
}: MangaOverviewProps) => {
    return (
        <div className="mt-4 grid grid-cols-1 gap-3 xl:grid-cols-[1fr_1fr]">
            <div className="flex flex-col gap-3">
                <SectionCard title="Описание">
                    <div className="3xl:text-3xl mt-4 text-sm leading-relaxed text-gray-300 xl:text-xl">
                        <p>{description}</p>
                    </div>
                </SectionCard>
                <SectionCard title="Информация">
                    <DetailsTable data={tableData} />
                </SectionCard>
            </div>
            <div className="flex flex-col gap-3">
                <SectionCard title="Последние Главы">
                    <List
                        items={Array.from({ length: 10 }, (_, i) => ({
                            chapter: `${i + 1}`,
                            title: `Тайтл ${i + 1}`,
                        }))}
                        className="mt-3 flex flex-col gap-1"
                        listClassName={cn(
                            "grid grid-cols-[16px_2.5rem_1fr_auto_3rem] items-center gap-x-3",
                            "py-2 text-sm text-gray-300 transition hover:text-gray-100",
                        )}
                        renderItem={(item) => (
                            <>
                                <Circle className="w-2 fill-[#f43f5e] text-[#f43f5e]" />
                                <span className="tabular-nums">{item.chapter}</span>
                                <span className="truncate">{item.title}</span>
                                <span className="text-right text-gray-400">2 min ago</span>
                                <span className="text-right text-gray-400">New</span>
                            </>
                        )}
                    />
                </SectionCard>
            </div>
        </div>
    )
}
