import { cn } from "@/utils/cn"

export const SectionCard = ({
    children,
    className,
    title,
    action,
}: {
    children: React.ReactNode
    className?: string
    title?: string
    action?: React.ReactNode
}) => (
    <section
        className={cn(
            "rounded-2xl bg-linear-120 from-[#0f0d1a] to-[#0b0c15]",
            "px-7 pt-4 pb-4",
            "shadow-md shadow-black/20 backdrop-blur-xl",
            className,
        )}
    >
        {title && (
            <div className="flex items-center justify-between px-4">
                <h4 className="font-bold text-neutral-300 uppercase">{title}</h4>
                {action}
            </div>
        )}
        {children}
    </section>
)
