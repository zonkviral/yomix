import { cn } from "@/utils/cn"

interface CollectionButtonProps {
    isActive: boolean
    icon?: React.ReactNode
    label: string
    count?: number
    isEditable?: boolean
    onClick: () => void
}

export const CollectionButton = ({
    isActive,
    icon,
    label,
    isEditable,
    count,
    onClick,
}: CollectionButtonProps) => (
    <button
        disabled={isEditable}
        type="button"
        onClick={onClick}
        className={cn(
            "group/item flex w-full items-center gap-2 rounded p-1 text-left text-base transition-colors",
            isActive ? "text-white" : "text-white/70 hover:text-white",
        )}
    >
        {icon}
        <h4
            className={cn(
                `font-semibold ${isEditable ? "" : "group-hover/item:underline"}`,
                isActive && "underline",
            )}
        >
            {label}
        </h4>
        {count !== undefined && !isEditable && (
            <span className="ml-auto text-sm text-white/70">{count}</span>
        )}
    </button>
)
