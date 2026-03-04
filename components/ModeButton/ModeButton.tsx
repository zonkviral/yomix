export const ModeButton = ({
    label,
    active,
    onClick,
}: {
    label: string
    active: boolean
    onClick: () => void
}) => {
    return (
        <button
            onClick={onClick}
            className={`rounded px-2.5 py-1 text-xs font-medium transition-all ${
                active
                    ? "bg-white text-black"
                    : "text-white/50 hover:text-white/80"
            }`}
        >
            {label}
        </button>
    )
}
