import { cn } from "@/utils/cn"

// components/IconButton/IconButton.tsx
interface Props {
    onClick?: () => void
    children: React.ReactNode
    active?: boolean // for menu button active state
    className?: string
}

export const IconButton = ({ onClick, children, active, className }: Props) => (
    <button
        type="button"
        onClick={onClick}
        className={cn(
            "hover:bg-secondary cursor-pointer rounded p-1.5 text-white/50 transition-all duration-200 hover:text-white",
            active && "text-white",
            className,
        )}
    >
        {children}
    </button>
)
