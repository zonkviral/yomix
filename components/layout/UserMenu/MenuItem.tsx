import Link from "next/link"

import * as DropdownMenu from "@radix-ui/react-dropdown-menu"

import { cn } from "@/utils/cn"

import { LucideIcon } from "lucide-react"

interface BaseMenuItem {
    icon: LucideIcon
    label: string
    badge?: string
    danger?: boolean
}

export type MenuItemConfig =
    | (BaseMenuItem & { href: string; onClick?: never })
    | (BaseMenuItem & { href?: never; onClick: () => void })

const itemClass = (danger?: boolean) =>
    cn(
        "relative flex w-full cursor-pointer items-center gap-2.5 px-3.5 py-2",
        "group text-base transition-colors outline-none",
        danger
            ? "text-rose-500 hover:bg-rose-600/6"
            : "text-neutral-200 hover:bg-neutral-800",
    )

const ItemInner = ({ icon: Icon, label, badge, danger }: MenuItemConfig) => (
    <>
        <span className="absolute top-1 bottom-1 left-0 w-0.5 rounded-r-xs bg-rose-600 opacity-0 transition-opacity group-hover:opacity-100" />
        <Icon
            className={cn("w-4", danger ? "text-rose-500" : "text-neutral-500")}
        />
        <span className="flex-1">{label}</span>
        {badge && (
            <span className="rounded-xs border border-rose-600/20 bg-rose-600/10 px-1.5 py-px text-xs text-rose-500">
                {badge}
            </span>
        )}
    </>
)

export const MenuItem = (props: MenuItemConfig) => {
    const { href, danger, onClick } = props

    return (
        <DropdownMenu.Item asChild onClick={onClick}>
            {href ? (
                <Link href={href} className={itemClass(danger)}>
                    <ItemInner {...props} />
                </Link>
            ) : (
                <button type="button" className={itemClass(danger)}>
                    <ItemInner {...props} />
                </button>
            )}
        </DropdownMenu.Item>
    )
}
