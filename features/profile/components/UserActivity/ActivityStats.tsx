// function StatCard({ label, value }) {
//     return (
//         <div className="rounded-2xl bg-white/5 p-4">
//             <div className="text-[11px] leading-tight text-white/40">
//                 {label}
//             </div>
//             <div className="mt-1.5 text-lg font-bold">{value}</div>
//         </div>
//     )
// }
interface StatItem {
    hours: string
    chapters: number
    ratings: number
}

const StatsLabels = {
    hours: "Время чтения",
    chapters: "Прочитано глав",
    ratings: "Оценок",
}

export const ActivityStats = ({ stats }: { stats: StatItem }) => (
    <div className="mb-6 grid grid-cols-3 gap-3">
        {Object.entries(stats).map(([key, value], index) => (
            <div
                key={index}
                className="flex flex-col gap-1 rounded-xl border border-white/5 bg-white/2 p-4 transition-colors hover:bg-white/4"
            >
                <span className="text-xs font-medium text-white/40">
                    {StatsLabels[key as keyof StatItem]}
                </span>
                <span className="text-lg font-bold tracking-tight text-white">
                    {value}
                </span>
            </div>
        ))}
    </div>
)
