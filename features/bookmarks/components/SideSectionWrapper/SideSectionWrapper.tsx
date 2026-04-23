export const SideSectionWrapper = ({
    children,
    title,
    icon,
}: {
    children: React.ReactNode
    title: string
    icon?: React.ReactNode
}) => (
    <section className="rounded bg-neutral-900 p-3 shadow-md">
        {icon}
        <h2 className="text-lg font-bold text-neutral-200">{title}</h2>
        {children}
    </section>
)
