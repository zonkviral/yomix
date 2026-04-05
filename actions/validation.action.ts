"use server"

import { createClient } from "@/lib/supabase/server"

export const register = async (formData: {
    email: string
    password: string
    username: string
}) => {
    const { email, password, username } = formData

    // Server-side validation — never trust the client
    if (!username || username.trim().length < 3)
        return { error: "Имя пользователя слишком короткое" }

    if (!/^[a-zA-Z0-9_-]+$/.test(username.trim()))
        return { error: "Только буквы, цифры, - и _" }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
        return { error: "Некорректный email" }

    if (!password || password.length < 6)
        return { error: "Пароль слишком короткий" }

    const supabase = await createClient()

    // 1. Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
            data: { username: username.trim() },
        },
    })

    if (authError) return { error: authError.message }
    if (!authData.user) return { error: "Не удалось создать аккаунт" }

    // 2. Upsert profile — don't rely on trigger alone
    const { error: profileError } = await supabase
        .from("profiles")
        .upsert({ id: authData.user.id, username: username.trim() })
        .select()

    if (profileError)
        return { error: `Profile creation failed: ${profileError.message}` }

    return { success: true }
}

export const login = async (formData: { email: string; password: string }) => {
    const { email, password } = formData

    if (!email || !password) return { error: "Заполните все поля" }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
        return { error: "Некорректный email" }

    const supabase = await createClient()

    const { error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
    })

    if (error) return { error: error.message }

    return { success: true }
}

export const logout = async () => {
    const supabase = await createClient()
    await supabase.auth.signOut()
    return { success: true }
}
