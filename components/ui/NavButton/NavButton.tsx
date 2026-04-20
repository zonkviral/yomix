import { cn } from "@/utils/cn"

interface NavButtonProps {
    onClick?: () => void
    disabled?: boolean
    children: React.ReactNode
    className?: string
}

export const NavButton = ({
    onClick,
    disabled,
    children,
    className,
}: NavButtonProps) => (
    <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={cn(
            "hover:bg-secondary flex cursor-pointer items-center rounded px-2 py-1 text-sm text-white/50 transition-all duration-200 hover:text-white disabled:cursor-default disabled:opacity-20",
            className,
        )}
    >
        {children}
    </button>
)
