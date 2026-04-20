import { Children, ReactNode } from "react"
import { cn } from "@/utils/cn"

interface Props {
    children: ReactNode
    activeIndex?: number
    className?: string
}

export const RadioGroup = ({ children, activeIndex, className }: Props) => {
    const count = Children.count(children)

    return (
        <div
            className={cn(
                "relative flex items-center rounded-md bg-white/5 p-1",
                className,
            )}
        >
            {activeIndex !== undefined && (
                <span
                    className="absolute top-1 bottom-1 rounded bg-rose-900 transition-transform duration-300 ease-in-out"
                    style={{
                        width: `calc((100% - 8px) / ${count})`,
                        transform: `translateX(calc(${activeIndex} * 100%))`,
                    }}
                />
            )}
            {children}
        </div>
    )
}
