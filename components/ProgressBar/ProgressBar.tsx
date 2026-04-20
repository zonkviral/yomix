export const ProgressBar = ({
    current,
    total,
}: {
    current: number
    total: number
}) => {
    const progress = Math.round((current / total) * 100)
    return (
        <div className="flex flex-col gap-2">
            <div className="h-1 w-full rounded-full bg-white/10">
                <div
                    className="h-1 rounded-full bg-rose-600/70"
                    style={{ width: `${progress}%` }}
                />
            </div>
            <div className="flex w-full justify-between text-gray-500">
                <span>
                    Глава {current}/{total}
                </span>
                <span>{progress}%</span>
            </div>
        </div>
    )
}
