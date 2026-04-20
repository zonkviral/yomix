import { Check, Eye, EyeOff, X } from "lucide-react"

export const PasswordToggle = ({
    show,
    onToggle,
}: {
    show: boolean
    onToggle: () => void
}) => (
    <button
        className="px-4 py-3 text-sm text-rose-50 select-none hover:underline"
        onClick={onToggle}
        type="button"
    >
        {show ? <Eye className="w-4" /> : <EyeOff className="w-4" />}
    </button>
)

export const EmailIcon = ({
    touched,
    valid,
}: {
    touched: boolean
    valid: boolean
}) => {
    if (!touched) return null
    return valid ? (
        <span className="px-3">
            <Check className="w-4 text-emerald-400" />
        </span>
    ) : (
        <span className="px-3">
            <X className="w-4 text-rose-400" />
        </span>
    )
}
