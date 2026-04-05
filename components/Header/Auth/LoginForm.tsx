import { useState } from "react"

import { login } from "@/actions/validation.action"
import { useAuth } from "@/context/AuthContext"

import { AnimatedBorder } from "@/components/AnimatedBorder/AnimatedBorder"
import { Divider } from "@/components/Divider/Divider"
import { InputField } from "@/components/InputField/InputField"
import { ShakeWrapper } from "@/components/ShakeWrapper/ShakeWrapper"
import { OAuthButtons } from "./OAuthButtons"
import { EmailIcon, PasswordToggle } from "./FormComponents"

import { useFormValidation } from "@/hooks/useFormValidation"

import { useRouter } from "next/navigation"

import { Lock, LockKeyhole, Mail, Square, SquareCheck } from "lucide-react"

export const LoginForm = ({
    onSwitchToRegister,
}: {
    onSwitchToRegister: () => void
}) => {
    const { refreshAuth, loading } = useAuth()
    const router = useRouter()
    const [showPassword, setShowPassword] = useState(false)
    const [rememberMe, setRememberMe] = useState(false)

    const {
        values,
        errors,
        touched,
        shakeCounters,
        serverError,
        setServerError,
        handleChange,
        handleBlur,
        handleSubmit,
    } = useFormValidation({ email: "", password: "" }, "login")

    const onSubmit = async (data: typeof values) => {
        const result = await login({
            email: data.email,
            password: data.password,
        })

        if (result.error) {
            setServerError(result.error)
        } else {
            await refreshAuth()
            router.refresh()
        }
    }

    const emailValid = !errors.email && !!values.email

    return (
        <form
            onSubmit={(e) => handleSubmit(e, onSubmit)}
            noValidate
            className="flex w-full flex-col gap-2"
        >
            <div className="animate-in fade-in slide-in-from-bottom-2 flex flex-col gap-2 duration-200">
                <div className="my-1 flex items-center gap-2 text-2xl text-rose-500/80">
                    <LockKeyhole className="mb-1" />
                    <h2>Логин</h2>
                </div>
                <p className="mb-2 text-sm text-rose-50/70">
                    Добро пожаловать! Войдите в свой аккаунт, чтобы продолжить.
                </p>

                <OAuthButtons label="Login" />
                <Divider />

                <div className="flex flex-col gap-2 rounded text-white">
                    {/* Server error */}
                    {serverError && (
                        <p className="rounded bg-rose-500/10 px-3 py-2 text-sm text-rose-400">
                            {serverError}
                        </p>
                    )}

                    <ShakeWrapper shakeKey={shakeCounters.get("email") ?? 0}>
                        <InputField
                            icon={
                                <Mail className="w-4 shrink-0 text-rose-50/50" />
                            }
                            placeholder="mail@example.com"
                            type="email"
                            id="login-mail"
                            value={values.email}
                            onChange={(e) =>
                                handleChange("email", e.target.value)
                            }
                            onBlur={() => handleBlur("email")}
                            autoFocus
                            rightSlot={
                                <EmailIcon
                                    touched={!!touched.email}
                                    valid={emailValid}
                                />
                            }
                        />
                    </ShakeWrapper>

                    <ShakeWrapper shakeKey={shakeCounters.get("password") ?? 0}>
                        <InputField
                            icon={
                                <Lock className="w-4 shrink-0 text-rose-50/50" />
                            }
                            placeholder="Пароль"
                            type={showPassword ? "text" : "password"}
                            id="login-password"
                            value={values.password}
                            onChange={(e) =>
                                handleChange("password", e.target.value)
                            }
                            onBlur={() => handleBlur("password")}
                            rightSlot={
                                <PasswordToggle
                                    show={showPassword}
                                    onToggle={() =>
                                        setShowPassword(!showPassword)
                                    }
                                />
                            }
                        />
                    </ShakeWrapper>

                    <div className="flex items-center justify-between">
                        <label
                            htmlFor="remember-me"
                            className="flex cursor-pointer items-center text-sm text-rose-50 select-none"
                        >
                            <input
                                type="checkbox"
                                id="remember-me"
                                checked={rememberMe}
                                onChange={() => setRememberMe(!rememberMe)}
                                className="sr-only"
                            />
                            {rememberMe ? (
                                <SquareCheck className="mr-1 h-4 w-4 text-rose-500/80" />
                            ) : (
                                <Square className="mr-1 h-4 w-4 text-rose-600/70" />
                            )}
                            Запомнить меня
                        </label>
                        <button
                            type="button"
                            className="px-4 py-3 text-sm text-rose-50 hover:underline"
                        >
                            Забыл пароль?
                        </button>
                    </div>

                    <AnimatedBorder
                        isAnimating={loading}
                        className="w-full overflow-hidden rounded-xl p-px"
                    >
                        <button
                            type="submit"
                            className="relative z-10 flex w-full items-center justify-center rounded-xl bg-rose-600/70 px-4 py-3 text-sm font-medium text-white hover:bg-rose-600/60"
                        >
                            Войти
                        </button>
                    </AnimatedBorder>

                    <div className="text-center text-sm text-gray-500">
                        Нет аккаунта?{" "}
                        <button
                            type="button"
                            className="font-medium text-rose-500 hover:underline"
                            onClick={onSwitchToRegister}
                        >
                            Регистрация
                        </button>
                    </div>
                </div>
            </div>
        </form>
    )
}
