import { useRef, useState } from "react"

export const useHudVisibility = () => {
    const [visible, setVisible] = useState(false)
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

    const show = () => {
        if (timer.current) clearTimeout(timer.current)
        setVisible(true)
    }

    const hide = () => {
        timer.current = setTimeout(() => setVisible(false), 300)
    }

    return { visible, show, hide }
}
