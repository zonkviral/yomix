import { ReadStatus } from "@/lib/supabase/type"

import {
    Bookmark,
    BookmarkX,
    BookOpen,
    BookPlus,
    Check,
    ListCheck,
    LucideIcon,
    Pause,
    PenIcon,
    Trash,
} from "lucide-react"

export interface DefaultCollection {
    value: ReadStatus
    label: string
    icon: LucideIcon
    color: string
}

export const defaultCollections = [
    {
        value: "reading",
        label: "Читаю",
        icon: BookOpen,
        color: "text-rose-400",
    },
    {
        value: "completed",
        label: "Прочитано",
        icon: Check,
        color: "text-emerald-400",
    },
    {
        value: "plan_to_read",
        label: "Запланировано",
        icon: Bookmark,
        color: "text-purple-400",
    },
    {
        value: "dropped",
        label: "Брошено",
        icon: BookmarkX,
        color: "text-red-400",
    },
    {
        value: "on_hold",
        label: "На паузе",
        icon: Pause,
        color: "text-amber-400",
    },
] as DefaultCollection[]

interface MenuItem {
    id: string
    label: string
    icon?: LucideIcon
    danger?: boolean
    onClick?: (value: string) => void
    options?: DefaultCollection[]
}

export const menuItems: MenuItem[] = [
    {
        id: "change-read-status",
        label: "Пометить как...",
        icon: ListCheck,
        options: defaultCollections,
    },
    { id: "add-to-collection", label: "Добавить в коллекцию", icon: BookPlus },
    { id: "edit", label: "Редактировать", icon: PenIcon },
    { id: "remove", label: "Удалить из закладок", danger: true, icon: Trash },
]
