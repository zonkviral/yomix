import { useEffect, useRef } from "react"

export const ShakeWrapper = ({
    shakeKey,
    children,
}: {
    shakeKey: number
    children: React.ReactNode
}) => {
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (shakeKey === 0) return
        const el = ref.current
        if (!el) return

        el.classList.remove("animate-shake")
        void el.offsetWidth
        el.classList.add("animate-shake")
    }, [shakeKey])

    return <div ref={ref}>{children}</div>
}
