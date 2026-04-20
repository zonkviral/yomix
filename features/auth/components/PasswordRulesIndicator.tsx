import { Check, X } from "lucide-react"
import type { PasswordRules } from "@/features/auth/hooks/useFormValidation"

const rules: { key: keyof PasswordRules; label: string }[] = [
    { key: "minLength", label: "Минимум 6 символов" },
    { key: "hasUppercase", label: "Заглавная буква" },
    { key: "hasNumber", label: "Цифра" },
]

export const PasswordRulesIndicator = ({
    rules: passwordRules,
    visible,
}: {
    rules: PasswordRules
    visible: boolean
}) => {
    if (!visible) return null

    return (
        <div className="flex flex-col gap-1 px-1">
            {rules.map(({ key, label }) => {
                const ok = passwordRules[key]
                return (
                    <div key={key} className="flex items-center gap-2">
                        <span
                            className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full transition-colors duration-200 ${
                                ok ? "bg-emerald-500/20" : "bg-rose-500/10"
                            }`}
                        >
                            {ok ? (
                                <Check className="h-2.5 w-2.5 text-emerald-400" />
                            ) : (
                                <X className="h-2.5 w-2.5 text-rose-500/50" />
                            )}
                        </span>
                        <span
                            className={`text-xs transition-colors duration-200 ${
                                ok ? "text-emerald-400" : "text-rose-50/40"
                            }`}
                        >
                            {label}
                        </span>
                    </div>
                )
            })}
        </div>
    )
}
