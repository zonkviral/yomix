import { cn } from "@/utils/cn"
import { ComponentProps } from "react"

export const PaginationButton = ({
    className,
    ...props
}: ComponentProps<"button">) => (
    <button
        className={cn(
            `rounded-md border border-rose-950 px-4 py-2 text-sm not-disabled:hover:bg-neutral-700 disabled:opacity-40 ${className ?? ""}`,
        )}
        {...props}
    />
)
