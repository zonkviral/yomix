import { Skeleton } from "@/components/feedback/Skeleton/Skeleton"

export const SkeletonSearchCard = () => (
    <div className="grid grid-cols-2">
        {Array(4)
            .fill(0)
            .map((_, i) => (
                <div
                    key={i}
                    className="flex animate-pulse items-center gap-3 px-3 py-2"
                >
                    <Skeleton className="h-14 w-10 shrink-0" />
                    <div className="flex flex-1 flex-col gap-2">
                        <Skeleton className="h-3 w-3/4" />
                        <Skeleton className="h-2.5 w-1/3" />
                    </div>
                </div>
            ))}
    </div>
)
