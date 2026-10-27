import Link from "next/link"
import { cn } from "@/utils/cn"

export const TabNav = ({ active = "overview" }: { active?: string }) => {
    const tabs = [
        { id: "overview", label: "Overview", href: "?tab=overview" },
        { id: "chapters", label: "Chapters", href: "?tab=chapters" },
    ]

    return (
        <div className="col-span-2 flex border-b border-solid border-zinc-800/80 text-sm font-medium">
            {tabs.map((tab) => {
                const isActive = active === tab.id

                return (
                    <Link
                        key={tab.id}
                        href={tab.href}
                        scroll={false}
                        className={cn(
                            "-mb-px border-b-2 px-4 pb-2 transition-all hover:text-white/80",
                            isActive
                                ? "border-rose-500 text-[#f43f5e]"
                                : "border-transparent text-white/50",
                        )}
                    >
                        {tab.label}
                    </Link>
                )
            })}
        </div>
    )
}
