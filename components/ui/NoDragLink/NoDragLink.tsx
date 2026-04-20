"use client"

import { useRef } from "react"

import Link from "next/link"

interface NoDragLinkProps {
    href: string
    className?: string
    children: React.ReactNode
}

export const NoDragLink = ({ href, className, children }: NoDragLinkProps) => {
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
