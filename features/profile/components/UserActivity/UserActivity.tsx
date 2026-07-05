"use client"

import { useState } from "react"
import { SectionWrapper } from "../SectionWrapper"
import { ActivityTabs } from "./ActivityTabs"
import { ActivityStats } from "./ActivityStats"
import { ActivityChart } from "./ActivityChart/ActivityChart"

const GENRES = [
    { name: "Психологическое", pct: 32 },
    { name: "Драма", pct: 25 },
    { name: "Триллер", pct: 18 },
    { name: "Сэйнэн", pct: 15 },
    { name: "Фэнтези", pct: 10 },
]

const DATA = {
    week: {
        bars: [
            { label: "Пн", value: 7 },
            { label: "Вт", value: 30 },
            { label: "Ср", value: 9 },
            { label: "Чт", value: 8.5 },
            { label: "Пт", value: 20 },
            { label: "Сб", value: 19 },
            { label: "Вс", value: 16 },
        ],
        stats: { hours: "18ч 37м", chapters: 143, ratings: 87 },
    },
    month: {
        bars: [
            { label: "1 нед", value: 42 },
            { label: "2 нед", value: 61 },
            { label: "3 нед", value: 38 },
            { label: "4 нед", value: 55 },
        ],
        stats: { hours: "76ч 12м", chapters: 512, ratings: 301 },
    },
    year: {
        bars: [
            { label: "Янв", value: 60 },
            { label: "Фев", value: 45 },
            { label: "Мар", value: 80 },
            { label: "Апр", value: 55 },
            { label: "Май", value: 70 },
            { label: "Июн", value: 90 },
            { label: "Июл", value: 65 },
            { label: "Авг", value: 50 },
            { label: "Сен", value: 75 },
            { label: "Окт", value: 85 },
            { label: "Ноя", value: 60 },
            { label: "Дек", value: 95 },
        ],
        stats: { hours: "412ч 05м", chapters: 4380, ratings: 2210 },
    },
}

export const UserActivity = () => {
    const [period, setPeriod] = useState<"week" | "month" | "year">("week")
    const { bars, stats } = DATA[period]

    return (
        <SectionWrapper
            title="Активность"
            action={<ActivityTabs period={period} setPeriod={setPeriod} />}
        >
            <ActivityChart bars={bars} />
            <ActivityStats stats={stats} />
            <div>
                <h4 className="mb-3 font-semibold tracking-wider text-white/40">
                    Любимые жанры
                </h4>
                <div className="flex flex-wrap gap-2">
                    {GENRES.map((g) => (
                        <div
                            key={g.name}
                            className="flex items-center gap-1.5 rounded-full border border-rose-400/20 bg-rose-400/10 px-3 py-1.5 text-xs font-medium text-violet-200"
                        >
                            {g.name}
                            <span className="font-semibold text-[#f43f5e]">
                                {g.pct}%
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </SectionWrapper>
    )
}
