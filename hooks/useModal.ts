import { useState, useCallback, useEffect } from "react"

export const useModal = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false)

    useEffect(() => {
        if (isOpen) document.body.style.overflow = "hidden"
        else document.body.style.overflow = ""
        return () => {
            document.body.style.overflow = ""
        }
    }, [isOpen])

    const open = useCallback(() => setIsOpen(true), [])
    const close = useCallback(() => setIsOpen(false), [])
    const toggle = useCallback(() => setIsOpen((prev) => !prev), [])
    return { isOpen, open, close, toggle }
}
