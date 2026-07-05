import { cn } from "@/utils/cn"
import { useState } from "react"

interface BarData {
    label: string
    value: number
}

export const ChartBars = ({
    bars,
    axisMax,
}: {
    bars: BarData[]
    axisMax: number
}) => {
    const [hovered, setHovered] = useState<number | null>(null)
    return (
        <div className="relative z-10 flex h-full items-end gap-2 pb-6">
            {bars.map((bar: BarData, i) => {
                const heightPct =
                    axisMax === 0 ? 0 : (bar.value / axisMax) * 100
                const hasValue = bar.value > 0

                return (
                    <div
                        key={bar.label}
                        className="group relative flex h-full flex-1 flex-col items-center justify-end"
                        onMouseEnter={() => setHovered(i)}
                        onMouseLeave={() => setHovered(null)}
                    >
                        <div
                            style={{
                                height: `${hasValue ? Math.max(heightPct, 6) : 0}%`,
                            }}
                            className="relative flex w-full max-w-6.5 justify-center"
                        >
                            {hovered === i && hasValue && (
                                <div className="animate-in fade-in zoom-in-95 absolute -top-8 z-30 rounded-md bg-white px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap text-black shadow-xl duration-150">
                                    {bar.value} гл.
                                </div>
                            )}

                            <div
                                className={cn(
                                    "h-full w-full cursor-pointer rounded-t-md transition-all duration-500 ease-out",
                                    "bg-linear-to-t from-rose-700 to-rose-400 group-hover:from-rose-600 group-hover:to-rose-300",
                                    "shadow-[0_0_12px_rgba(139,92,246,0.2)] group-hover:shadow-[0_0_16px_rgba(139,92,246,0.4)]",
                                    !hasValue &&
                                        "pointer-events-none bg-neutral-800/40 shadow-none",
                                )}
                            />
                        </div>

                        <span className="absolute -bottom-5 w-full truncate text-center text-[11px] font-medium text-white/40">
                            {bar.label}
                        </span>
                    </div>
                )
            })}
        </div>
    )
}
