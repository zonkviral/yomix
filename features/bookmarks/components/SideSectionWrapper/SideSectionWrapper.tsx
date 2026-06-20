import { Pen } from "lucide-react"

export const SideSectionWrapper = ({
    children,
    title,
    icon,
    isEditable = false,
    onEdit,
}: {
    children: React.ReactNode
    title: string
    icon?: React.ReactNode
    isEditable?: boolean
    onEdit?: () => void
}) => (
    <section className="rounded bg-neutral-900 p-3 shadow-md">
        {icon}
        <div className="flex">
            <h2 className="text-lg font-bold text-neutral-200">{title}</h2>
            {isEditable && (
                <button
                    className="bg-secondary hover:bg-secondary-hover ml-auto flex self-center rounded px-1 hover:text-rose-400"
                    title="Редактировать"
                    onClick={onEdit}
                >
                    <Pen className="w-4 text-rose-600 hover:text-inherit" />
                </button>
            )}
        </div>
        {children}
    </section>
)
