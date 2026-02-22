"use client"

import { useRef } from "react"

import Link from "next/link"

export const NoDragLink = ({
    href,
    className,
    children,
}: {
    href: string
    className?: string
    children: React.ReactNode
}) => {
    const selecting = useRef(false)

    return (
        <Link
            href={href}
            className={className}
            draggable={false}
            onMouseDown={() => (selecting.current = false)}
            onMouseMove={() => (selecting.current = true)}
            onClick={(e) => {
                if (selecting.current) e.preventDefault()
            }}
        >
            {children}
        </Link>
    )
}
