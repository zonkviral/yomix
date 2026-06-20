import { ReadStatus } from "@/lib/supabase/type"

import {
    BookA,
    Bookmark,
    BookmarkX,
    BookOpen,
    Check,
    LucideIcon,
    Pause,
} from "lucide-react"

export interface statusCollection {
    value: ReadStatus
    label: string
    icon: LucideIcon
    color: string
}

export const statusCollections = [
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
] as statusCollection[]

export const defaultCollections = [
    { value: "all", label: "Все", icon: BookA, color: "text-sky-400" },
    ...statusCollections,
] as statusCollection[]
