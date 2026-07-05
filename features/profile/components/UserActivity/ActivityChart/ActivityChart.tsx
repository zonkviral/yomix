/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from "react"

import { ChartBars } from "./Bars"

export const ActivityChart = ({
    bars,
}: {
    bars: { label: string; value: number }[]
}) => {
    const axisMax = useMemo(() => {
        const rawMax = Math.max(...bars.map((b: any) => b.value), 0)
        if (rawMax === 0) return 10
        const step = rawMax <= 30 ? 5 : rawMax <= 150 ? 25 : 100
        return Math.ceil(rawMax / step) * step
    }, [bars])

    const gridlines = [1, 0.75, 0.5, 0.25, 0].map((f) =>
        Math.round(axisMax * f),
    )

    return (
        <div className="my-6 flex h-48 gap-3 select-none">
            {/* Y-Axis */}
            <div className="flex w-5 flex-col justify-between pt-1 pb-6 text-right text-[11px] font-medium text-white/30">
                {gridlines.map((g, i) => (
                    <span key={`${g}-${i}`}>{g}</span>
                ))}
            </div>
            {/* X-Axis */}
            <div className="relative h-full flex-1">
                <div className="pointer-events-none absolute inset-0 bottom-6 flex flex-col justify-between">
                    {gridlines.map((g, i) => (
                        <div
                            key={`${g}-${i}`}
                            className="w-full border-t border-white/5"
                        />
                    ))}
                </div>
                <ChartBars bars={bars} axisMax={axisMax} />
            </div>
        </div>
    )
}
