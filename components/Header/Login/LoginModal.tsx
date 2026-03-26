import { useState } from "react"

import { AnimatedBorder } from "@/components/AnimatedBorder/AnimatedBorder"
import { Divider } from "@/components/Divider/Divider"
import { InputField } from "@/components/InputField/InputField"
import { OAuthButtons } from "./OAuthButtons"

import {
    Eye,
    EyeOff,
    Lock,
    LockKeyhole,
    Mail,
    Square,
    SquareCheck,
    User,
    UserPlus,
} from "lucide-react"

const PasswordToggle = ({
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

export const LoginModal = () => {
    const [view, setView] = useState<"login" | "register">("login")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [rememberMe, setRememberMe] = useState(false)
    const [username, setUsername] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const isLogin = view === "login"

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Add form submission logic here
        console.log("Form submitted")
    }

    return (
        <form onSubmit={handleSubmit} className="flex w-full flex-col gap-2">
            <div
                key={view}
                className="animate-in fade-in slide-in-from-bottom-2 flex flex-col gap-2 duration-200"
            >
                <div className="my-1 flex items-center gap-2 text-2xl text-rose-500/80">
                    {isLogin ? (
                        <LockKeyhole className="mb-1" />
                    ) : (
                        <UserPlus className="mb-1" />
                    )}
                    <h2>{isLogin ? "Логин" : "Регистрация"}</h2>
                </div>
                <p className="mb-2 text-sm text-rose-50/70">
                    {isLogin
                        ? "Добро пожаловать! Войдите в свой аккаунт, чтобы продолжить."
                        : "Создайте аккаунт, чтобы начать."}
                </p>

                <OAuthButtons label={isLogin ? "Login" : "Register"} />
                <Divider />

                <div className="flex flex-col gap-2 rounded text-white">
                    {!isLogin && (
                        <InputField
                            icon={
                                <User className="w-4 shrink-0 text-rose-50/50" />
                            }
                            placeholder="Имя пользователя"
                            type="text"
                            id="register-username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            autoFocus
                        />
                    )}

                    <InputField
                        icon={<Mail className="w-4 shrink-0 text-rose-50/50" />}
                        placeholder="mail@example.com"
                        type="text"
                        id="login-mail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoFocus={isLogin}
                    />

                    <InputField
                        icon={<Lock className="w-4 shrink-0 text-rose-50/50" />}
                        placeholder="Пароль"
                        type={showPassword ? "text" : "password"}
                        id="login-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        rightSlot={
                            <PasswordToggle
                                show={showPassword}
                                onToggle={() => setShowPassword(!showPassword)}
                            />
                        }
                    />

                    {!isLogin && (
                        <InputField
                            icon={
                                <Lock className="w-4 shrink-0 text-rose-50/50" />
                            }
                            placeholder="Подтвердите пароль"
                            type={showConfirmPassword ? "text" : "password"}
                            id="register-confirm-password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            rightSlot={
                                <PasswordToggle
                                    show={showConfirmPassword}
                                    onToggle={() =>
                                        setShowConfirmPassword(
                                            !showConfirmPassword,
                                        )
                                    }
                                />
                            }
                        />
                    )}

                    {isLogin && (
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
                                    className="mr-1 h-4 w-4 cursor-pointer appearance-none focus:outline-none"
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
                    )}

                    <AnimatedBorder
                        isAnimating={false}
                        className="w-full overflow-hidden rounded-xl p-px"
                    >
                        <button
                            type="submit"
                            className="relative z-10 flex w-full items-center justify-center rounded-xl bg-rose-600/70 px-4 py-3 text-sm font-medium text-white hover:bg-rose-600/60"
                        >
                            {isLogin ? "Войти" : "Зарегистрироваться"}
                        </button>
                    </AnimatedBorder>

                    <div className="text-center text-sm text-gray-500">
                        {isLogin ? "Нет аккаунта?" : "Уже есть аккаунт?"}{" "}
                        <button
                            type="button"
                            className="font-medium text-rose-500 hover:underline"
                            onClick={() =>
                                setView(isLogin ? "register" : "login")
                            }
                        >
                            {isLogin ? "Регистрация" : "Войти"}
                        </button>
                    </div>
                </div>
            </div>
        </form>
    )
}
