"use server"

import { createClient } from "@/lib/supabase/server"

export const register = async (formData: {
    email: string
    password: string
    username: string
}) => {
    const { email, password, username } = formData

    if (!username || username.trim().length < 3)
        return { error: "Имя пользователя слишком короткое" }

    if (!/^[a-zA-Z0-9_-]+$/.test(username.trim()))
        return { error: "Только буквы, цифры, - и _" }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
        return { error: "Некорректный email" }

    if (!password || password.length < 6)
        return { error: "Пароль слишком короткий" }

    const supabase = await createClient()

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
            data: { username: username.trim() },
        },
    })

    if (authError) return { error: authError.message }
    if (!authData.user) return { error: "Не удалось создать аккаунт" }

    // Upsert profile
    const { error: profileError } = await supabase
        .from("profiles")
        .upsert({ id: authData.user.id, username: username.trim() })
        .select()

    if (profileError)
        return { error: `Profile creation failed: ${profileError.message}` }
    return { success: true }
}
