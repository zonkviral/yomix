import { ReactNode } from "react"
import { cn } from "@/utils/cn"

interface Props {
    label: string
    value: string
    name: string
    checked: boolean
    onChange: () => void
    className?: string
    renderOption?: (checked: boolean) => ReactNode
}

export const RadioTab = ({
    label,
    value,
    name,
    checked,
    onChange,
    className,
    renderOption,
}: Props) => (
    <label className={cn("relative z-10 cursor-pointer", className)}>
        <input
            type="radio"
            name={name}
            value={value}
            checked={checked}
            onChange={onChange}
            className="sr-only"
        />
        {renderOption ? (
            renderOption(checked)
        ) : (
            <span
                className={cn(
                    "block rounded px-2.5 py-1 text-sm font-medium transition-colors duration-300",
                    checked
                        ? "text-white"
                        : "text-white/50 hover:text-white/80",
                )}
            >
                {label}
            </span>
        )}
    </label>
)
