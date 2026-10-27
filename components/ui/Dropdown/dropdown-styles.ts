import { cn } from "@/utils/cn"

export const dropdownTriggerStyles = cn(
    "group/select flex cursor-pointer items-center gap-1.5 rounded px-2 py-1 text-sm",
    "text-white/50 transition-all duration-200 outline-none",
    "hover:bg-secondary hover:text-white",
    "disabled:cursor-default disabled:opacity-50",
    "data-[state=open]:bg-secondary data-[state=open]:text-white",
)

export const dropdownContentStyles = cn(
    "z-3 max-h-72 max-w-65 min-w-26 rounded-xl",
    "bg-primary shadow-[0px_8px_32px_black]",
    "data-[state=open]:animate-in data-[state=closed]:animate-out",
    "data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0",
    "data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95",
    "data-[side=top]:slide-in-from-bottom-2",
    "data-[side=bottom]:slide-in-from-top-2",
)

export const dropdownItemStyles = cn(
    "relative flex cursor-pointer items-center rounded px-3 py-2 text-sm outline-none select-none first:rounded-t-xl last:rounded-b-xl",
    "text-white/50 transition-colors duration-150",
    "data-highlighted:bg-secondary data-highlighted:text-white",
    "data-[state=checked]:text-white",
)

export const dropdownChevronStyles =
    "w-3.5 text-white/40 transition group-data-[state=open]/select:rotate-180"
