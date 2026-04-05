import { useState } from "react"

import { LoginForm } from "./LoginForm"
import { RegisterForm } from "./RegisterForm"

export const AuthModal = () => {
    const [view, setView] = useState<"login" | "register">("login")

    return (
        <div className="flex w-full flex-col gap-2">
            {view === "login" ? (
                <LoginForm onSwitchToRegister={() => setView("register")} />
            ) : (
                <RegisterForm onSwitchToLogin={() => setView("login")} />
            )}
        </div>
    )
}
