import { useReducer } from "react"

import { AnimatedBorder } from "@/components/AnimatedBorder/AnimatedBorder"
import { Divider } from "@/components/Divider/Divider"
import { InputField } from "@/components/InputField/InputField"
import { OAuthButtons } from "./OAuthButtons"
import { EmailIcon, PasswordToggle } from "./FormComponents"
import { ShakeWrapper } from "@/components/ShakeWrapper/ShakeWrapper"
import { PasswordRulesIndicator } from "./PasswordRulesIndicator"
import { useFormValidation } from "@/hooks/useFormValidation"
import { register } from "@/actions/validation.action"

import { Lock, Mail, User, UserPlus } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"

const initialState = {
    showPassword: false,
    showConfirmPassword: false,
    passwordFocused: false,
}

type State = typeof initialState

type Action =
    | { type: "TOGGLE_SHOW_PASSWORD" }
    | { type: "TOGGLE_SHOW_CONFIRM_PASSWORD" }
    | { type: "SET_PASSWORD_FOCUSED"; payload: boolean }

export const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case "TOGGLE_SHOW_PASSWORD":
            return { ...state, showPassword: !state.showPassword }
        case "TOGGLE_SHOW_CONFIRM_PASSWORD":
            return { ...state, showConfirmPassword: !state.showConfirmPassword }
        case "SET_PASSWORD_FOCUSED":
            return { ...state, passwordFocused: action.payload }
        default:
            return state
    }
}

export const RegisterForm = ({
    onSwitchToLogin,
}: {
    onSwitchToLogin: () => void
}) => {
    const [state, dispatch] = useReducer(reducer, initialState)
    const { showPassword, showConfirmPassword, passwordFocused } = state
    const { refreshAuth, loading } = useAuth()
    const router = useRouter()

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
        passwordRules,
    } = useFormValidation(
        { username: "", email: "", password: "", confirmPassword: "" },
        "register",
    )

    const onSubmit = async (data: typeof values) => {
        const result = await register({
            email: data.email,
            password: data.password,
            username: data.username,
        })

        if (result.error) {
            return setServerError(result.error)
        }
        await refreshAuth()
        router.refresh()
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
                    <UserPlus className="mb-1" />
                    <h2>Регистрация</h2>
                </div>
                <p className="mb-2 text-sm text-rose-50/70">
                    Создайте аккаунт, чтобы начать.
                </p>

                <OAuthButtons label="Register" />
                <Divider />

                <div className="flex flex-col gap-2 rounded text-white">
                    {/* Server error */}
                    {serverError && (
                        <p className="rounded bg-rose-500/10 px-3 py-2 text-sm text-rose-400">
                            {serverError}
                        </p>
                    )}

                    <ShakeWrapper shakeKey={shakeCounters.get("username") ?? 0}>
                        <InputField
                            icon={
                                <User className="w-4 shrink-0 text-rose-50/50" />
                            }
                            placeholder="Имя пользователя"
                            type="text"
                            id="register-username"
                            value={values.username}
                            onChange={(e) =>
                                handleChange("username", e.target.value)
                            }
                            onBlur={() => handleBlur("username")}
                            autoFocus
                        />
                        {touched.username && errors.username && (
                            <p className="pt-1 pl-2 text-xs text-rose-500">
                                {errors.username}
                            </p>
                        )}
                    </ShakeWrapper>

                    <ShakeWrapper shakeKey={shakeCounters.get("email") ?? 0}>
                        <InputField
                            icon={
                                <Mail className="w-4 shrink-0 text-rose-50/50" />
                            }
                            placeholder="mail@example.com"
                            type="email"
                            id="register-mail"
                            value={values.email}
                            onChange={(e) =>
                                handleChange("email", e.target.value)
                            }
                            onBlur={() => handleBlur("email")}
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
                            id="register-password"
                            value={values.password}
                            onChange={(e) =>
                                handleChange("password", e.target.value)
                            }
                            onBlur={() => {
                                handleBlur("password")
                                dispatch({
                                    type: "SET_PASSWORD_FOCUSED",
                                    payload: false,
                                })
                            }}
                            onFocus={() =>
                                dispatch({
                                    type: "SET_PASSWORD_FOCUSED",
                                    payload: true,
                                })
                            }
                            rightSlot={
                                <PasswordToggle
                                    show={showPassword}
                                    onToggle={() =>
                                        dispatch({
                                            type: "TOGGLE_SHOW_PASSWORD",
                                        })
                                    }
                                />
                            }
                        />
                    </ShakeWrapper>

                    <PasswordRulesIndicator
                        rules={passwordRules}
                        visible={
                            passwordFocused ||
                            (!!touched.password && !!errors.password)
                        }
                    />

                    <ShakeWrapper
                        shakeKey={shakeCounters.get("confirmPassword") ?? 0}
                    >
                        <InputField
                            icon={
                                <Lock className="w-4 shrink-0 text-rose-50/50" />
                            }
                            placeholder="Подтвердите пароль"
                            type={showConfirmPassword ? "text" : "password"}
                            id="register-confirm-password"
                            value={values.confirmPassword}
                            onChange={(e) =>
                                handleChange("confirmPassword", e.target.value)
                            }
                            onBlur={() => handleBlur("confirmPassword")}
                            rightSlot={
                                <PasswordToggle
                                    show={showConfirmPassword}
                                    onToggle={() =>
                                        dispatch({
                                            type: "TOGGLE_SHOW_CONFIRM_PASSWORD",
                                        })
                                    }
                                />
                            }
                        />
                    </ShakeWrapper>

                    {touched.confirmPassword && errors.confirmPassword && (
                        <p className="pl-2 text-xs text-rose-500">
                            {errors.confirmPassword}
                        </p>
                    )}

                    <AnimatedBorder
                        isAnimating={loading}
                        className="w-full overflow-hidden rounded-xl p-px"
                    >
                        <button
                            type="submit"
                            className="relative z-10 flex w-full items-center justify-center rounded-xl bg-rose-600/70 px-4 py-3 text-sm font-medium text-white hover:bg-rose-600/60"
                        >
                            Зарегистрироваться
                        </button>
                    </AnimatedBorder>

                    <div className="text-center text-sm text-gray-500">
                        Уже есть аккаунт?{" "}
                        <button
                            type="button"
                            className="font-medium text-rose-500 hover:underline"
                            onClick={onSwitchToLogin}
                        >
                            Войти
                        </button>
                    </div>
                </div>
            </div>
        </form>
    )
}
