export const ToggleSwitch = ({
    id,
    checked,
    onChange,
}: {
    id: string
    checked: boolean
    onChange: (checked: boolean) => void
}) => (
    <div className="relative">
        <input
            id={id}
            type="checkbox"
            role="switch"
            aria-checked={checked}
            className="sr-only"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
        />
        <div
            aria-hidden
            className={`h-6 w-12 rounded-full transition-colors ${
                checked ? "bg-rose-600" : "bg-neutral-700"
            }`}
        />
        <div
            aria-hidden
            className={`absolute top-0.5 left-0.5 h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                checked ? "translate-x-6" : "translate-x-0"
            }`}
        />
    </div>
)
