import { BookPlus, ListCheck, LucideIcon, PenIcon, Trash } from "lucide-react"

import { statusCollection, statusCollections } from "./status"

interface MenuItem {
    id: string
    label: string
    icon?: LucideIcon
    danger?: boolean
    onClick?: (value: string) => void
    options?: statusCollection[]
}

export const menuItems: MenuItem[] = [
    {
        id: "change-read-status",
        label: "Пометить как...",
        icon: ListCheck,
        options: statusCollections,
    },
    { id: "add-to-collection", label: "Добавить в коллекцию", icon: BookPlus },
    { id: "edit", label: "Редактировать", icon: PenIcon },
    { id: "remove", label: "Удалить из закладок", danger: true, icon: Trash },
]
