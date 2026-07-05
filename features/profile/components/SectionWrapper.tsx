import { cn } from "@/utils/cn"

export const SectionWrapper = ({
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
            "px-5 pt-2 pb-5",
            "shadow-md shadow-black/20 backdrop-blur-xl",
            className,
        )}
    >
        {title && (
            <div className="flex justify-between">
                <h3 className="font-bold text-neutral-300 uppercase">
                    {title}
                </h3>
                {action}
            </div>
        )}
        {children}
    </section>
)
