import { cn } from "@/utils/cn"

export const Skeleton = ({ className }: { className?: string }) => (
    <div className={cn("animate-pulse rounded bg-neutral-800", className)} />
)
