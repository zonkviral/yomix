interface Stat {
    total_manga: number
    total_chapters: number
    total_time_mins: number
}

interface StatsSectionProps {
    stats: Stat
}

const statItems = [
    { key: "total_manga", label: "Манга" },
    { key: "total_chapters", label: "Главы" },
    { key: "total_time_mins", label: "Минуты" },
] as const

export const StatsSection = ({ stats }: StatsSectionProps) => (
    <section className="flex flex-col items-center rounded bg-neutral-900 p-2 shadow-md">
        <h2 className="self-start text-xl font-bold">Статистика</h2>
        <div className="mt-4 flex gap-4 text-center">
            {statItems.map(({ key, label }) => (
                <div
                    key={key}
                    className="rounded-md bg-neutral-800/15 px-2 py-1"
                >
                    <span className="text-base font-bold text-rose-500/80">
                        {stats[key]}
                    </span>
                    <h4 className="text-sm font-semibold text-gray-500/90 capitalize">
                        {label}
                    </h4>
                </div>
            ))}
        </div>
    </section>
)
