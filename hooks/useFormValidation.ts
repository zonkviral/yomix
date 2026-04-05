import { useState, useCallback, useMemo, SubmitEvent } from "react"

type LoginValues = {
    email: string
    password: string
}

type RegisterValues = {
    username: string
    email: string
    password: string
    confirmPassword: string
}

type FormValues = LoginValues | RegisterValues
type FormErrors<T> = Partial<Record<keyof T, string>>

export type PasswordRules = {
    minLength: boolean
    hasUppercase: boolean
    hasNumber: boolean
}

export function getPasswordRules(password: string): PasswordRules {
    return {
        minLength: password.length >= 6,
        hasUppercase: /[A-Z]/.test(password),
        hasNumber: /[0-9]/.test(password),
    }
}

function validateLogin(values: LoginValues): FormErrors<LoginValues> {
    const errors: FormErrors<LoginValues> = {}

    if (!values.email) {
        errors.email = "Email обязателен"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
        errors.email = "Некорректный email"
    }

    if (!values.password) {
        errors.password = "Пароль обязателен"
    } else if (values.password.length < 6) {
        errors.password = "Минимум 6 символов"
    }

    return errors
}

function validateRegister(values: RegisterValues): FormErrors<RegisterValues> {
    const errors: FormErrors<RegisterValues> = {}

    if (!values.username) {
        errors.username = "Имя пользователя обязательно"
    } else if (values.username.length < 3) {
        errors.username = "Минимум 3 символа"
    } else if (!/^[a-zA-Z0-9_-]+$/.test(values.username)) {
        errors.username = "Только буквы, цифры, - и _"
    }

    if (!values.email) {
        errors.email = "Email обязателен"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
        errors.email = "Некорректный email"
    }

    if (!values.password) {
        errors.password = "Пароль обязателен"
    } else {
        const rules = getPasswordRules(values.password)
        if (!rules.minLength || !rules.hasUppercase || !rules.hasNumber) {
            errors.password = "Пароль не соответствует требованиям"
        }
    }

    if (!values.confirmPassword) {
        errors.confirmPassword = "Подтвердите пароль"
    } else if (values.confirmPassword !== values.password) {
        errors.confirmPassword = "Пароли не совпадают"
    }

    return errors
}

export function useFormValidation<T extends FormValues>(
    initialValues: T,
    formType: "login" | "register",
) {
    const [values, setValues] = useState<T>(initialValues)
    const [errors, setErrors] = useState<FormErrors<T>>({})
    const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>(
        {},
    )
    const [serverError, setServerError] = useState<string | null>(null)
    const [shakeCounters, setShakeCounters] = useState<Map<keyof T, number>>(
        new Map(),
    )

    const validate = useCallback(
        (vals: T): FormErrors<T> => {
            if (formType === "login") {
                return validateLogin(vals as LoginValues) as FormErrors<T>
            }
            return validateRegister(vals as RegisterValues) as FormErrors<T>
        },
        [formType],
    )

    const triggerShake = useCallback((fields: Array<keyof T>) => {
        setShakeCounters((prev) => {
            const next = new Map(prev)
            fields.forEach((f) => next.set(f, (prev.get(f) ?? 0) + 1))
            return next
        })
    }, [])

    const handleChange = useCallback(
        (field: keyof T, value: string) => {
            const updated = { ...values, [field]: value }
            setValues(updated)
            setServerError(null)

            if (touched[field]) {
                const newErrors = validate(updated)
                setErrors((prev) => ({ ...prev, [field]: newErrors[field] }))
            }

            if (
                field === ("password" as keyof T) &&
                touched["confirmPassword" as keyof T]
            ) {
                const newErrors = validate(updated)
                setErrors((prev) => ({
                    ...prev,
                    confirmPassword: newErrors["confirmPassword" as keyof T],
                }))
            }
        },
        [values, touched, validate],
    )

    const handleBlur = useCallback(
        (field: keyof T) => {
            setTouched((prev) => ({ ...prev, [field]: true }))
            const newErrors = validate(values)
            setErrors((prev) => ({ ...prev, [field]: newErrors[field] }))
        },
        [values, validate],
    )

    const handleSubmit = useCallback(
        (e: SubmitEvent, onSuccess: (values: T) => void) => {
            e.preventDefault()
            setServerError(null)

            const allTouched = Object.keys(values).reduce(
                (acc, key) => ({ ...acc, [key]: true }),
                {},
            ) as Record<keyof T, boolean>
            setTouched(allTouched)

            const validationErrors = validate(values)
            setErrors(validationErrors)

            if (Object.keys(validationErrors).length === 0) {
                onSuccess(values)
            } else {
                triggerShake(Object.keys(validationErrors) as Array<keyof T>)
            }
        },
        [values, validate, triggerShake],
    )

    const isValid = useMemo(
        () => Object.keys(validate(values)).length === 0,
        [validate, values],
    )

    const passwordRules = useMemo(
        () =>
            getPasswordRules(
                "password" in values
                    ? (values as { password: string }).password
                    : "",
            ),
        [values],
    )

    return {
        values,
        errors,
        touched,
        shakeCounters,
        serverError,
        setServerError,
        handleChange,
        handleBlur,
        handleSubmit,
        isValid,
        passwordRules,
    }
}
