interface InputFieldProps {
    icon: React.ReactNode
    placeholder: string
    type: string
    id: string
    value: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    onBlur?: () => void
    autoFocus?: boolean
    rightSlot?: React.ReactNode
    onFocus?: () => void
}

export const InputField = ({
    icon,
    placeholder,
    type,
    id,
    value,
    onChange,
    autoFocus,
    rightSlot,
    onBlur,
    onFocus,
}: InputFieldProps) => (
    <div className="relative z-10 flex w-full items-stretch rounded-xl bg-[#101217]">
        <div className="flex items-center pl-4">{icon}</div>
        <div className="relative flex flex-1">
            <input
                placeholder={placeholder}
                autoFocus={autoFocus}
                className={`w-full bg-transparent py-2.5 pl-2 text-xl text-rose-50 outline-none placeholder:text-white/20 ${rightSlot ? "pr-30" : "pr-3"}`}
                type={type}
                id={id}
                value={value}
                onChange={onChange}
                autoComplete="off"
                onBlur={onBlur}
                onFocus={onFocus}
            />
            {rightSlot && (
                <div className="absolute top-0 right-0 flex h-full items-center">
                    {rightSlot}
                </div>
            )}
        </div>
    </div>
)
