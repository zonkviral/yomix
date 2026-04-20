"use client"

interface AnimatedBorderProps {
    children: React.ReactNode
    isAnimating: boolean
    className?: string
    role?: string
}

export const AnimatedBorder = ({
    children,
    isAnimating,
    className = "",
    role,
}: AnimatedBorderProps) => {
    return (
        <div
            className={`${isAnimating && "search-spin"} relative ${className}`}
            role={role}
        >
            {children}
        </div>
    )
}
