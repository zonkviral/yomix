interface DividerProps {
    text?: string
    color?: string
}

export const Divider = ({ text, color }: DividerProps) => (
    <div className="my-2 flex items-center text-sm text-gray-500">
        <span className={"h-px flex-1 " + (color || "bg-rose-600/70")} />
        <span className="px-3">{text || "или"}</span>
        <span className={"h-px flex-1 " + (color || "bg-rose-600/70")} />
    </div>
)
