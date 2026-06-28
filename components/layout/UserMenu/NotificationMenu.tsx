import * as DropdownMenu from "@radix-ui/react-dropdown-menu"

import { cn } from "@/utils/cn"

import { Bell } from "lucide-react"

export const NotificationMenu = () => {
    return (
        <DropdownMenu.Root modal={false}>
            <DropdownMenu.Trigger className={cn("flex items-center gap-2")}>
                <Bell className="h-6 w-6 text-white/50 hover:text-white" />
            </DropdownMenu.Trigger>
            <DropdownMenu.Content
                sideOffset={5}
                className="z-50 rounded bg-neutral-800 p-2 text-sm text-white shadow-md"
            >
                <DropdownMenu.Label className="px-2 py-1 text-sm text-white/50">
                    Уведомления
                </DropdownMenu.Label>
                <DropdownMenu.Separator className="my-1 h-px bg-neutral-700" />
                <DropdownMenu.Item className="cursor-pointer rounded px-2 py-1 hover:bg-neutral-700">
                    Нет уведомлений
                </DropdownMenu.Item>
            </DropdownMenu.Content>
        </DropdownMenu.Root>
    )
}
