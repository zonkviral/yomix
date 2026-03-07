interface HoverZoneProps {
    children: React.ReactNode
    onShow: () => void
    onHide: () => void
    className?: string
}

export const HoverZone = ({
    children,
    onShow,
    onHide,
    className,
}: HoverZoneProps) => {
    return (
        <div className={className} onMouseEnter={onShow} onMouseLeave={onHide}>
            {children}
        </div>
    )
}
