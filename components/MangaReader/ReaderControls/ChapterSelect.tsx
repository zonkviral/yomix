"use client"

import * as Select from "@radix-ui/react-select"
import { ChevronDown, Check } from "lucide-react"
import { useReader } from "../ReaderContext"
import { useReaderUI } from "./ReaderUIContext"
import { cn } from "@/utils/cn"

export const ChapterSelect = () => {
    const { chapterList, currentChapterId, switchChapter, chapterLoading } =
        useReader()
    const { setSelectOpen } = useReaderUI()
    console.log(chapterList)
    const current = chapterList.find((c) => c.id === currentChapterId)
    console.log(current)
    return (
        <Select.Root
            value={currentChapterId}
            onValueChange={switchChapter}
            onOpenChange={setSelectOpen}
            disabled={chapterLoading}
        >
            <Select.Trigger
                className={cn(
                    "flex cursor-pointer items-center gap-1.5 rounded px-2 py-1 text-sm",
                    "text-white/50 transition-all duration-200 outline-none",
                    "hover:bg-secondary hover:text-white",
                    "disabled:cursor-default disabled:opacity-50",
                    "data-[state=open]:bg-secondary data-[state=open]:text-white",
                )}
            >
                <Select.Value>
                    Глава {current?.attributes.chapter ?? "—"}
                </Select.Value>
                <Select.Icon>
                    <ChevronDown className="w-3.5 text-white/40" />
                </Select.Icon>
            </Select.Trigger>

            <Select.Content
                position="popper"
                side="top"
                align="center"
                sideOffset={1}
                className={cn(
                    "z-3 max-h-72 max-w-65 min-w-26 rounded-xl",
                    "bg-primary shadow-[0px_8px_32px_black]",
                    "data-[state=open]:animate-in data-[state=closed]:animate-out",
                    "data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0",
                    "data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95",
                    "data-[side=top]:slide-in-from-bottom-2",
                    "data-[side=bottom]:slide-in-from-top-2",
                )}
            >
                <Select.Viewport className="p-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {chapterList.map((chapter) => (
                        <Select.Item
                            key={chapter.id}
                            value={chapter.id}
                            className={cn(
                                "relative flex cursor-pointer items-center rounded px-3 py-2 text-sm outline-none select-none first:rounded-t-xl last:rounded-b-xl",
                                "text-white/50 transition-colors duration-150",
                                "data-highlighted:bg-secondary data-highlighted:text-white",
                                "data-[state=checked]:text-white",
                            )}
                        >
                            <Select.ItemText>
                                Глава {chapter.attributes.chapter}
                                {chapter.attributes.title
                                    ? ` — ${chapter.attributes.title}`
                                    : ""}
                            </Select.ItemText>
                            <Select.ItemIndicator className="absolute right-2">
                                <Check className="w-3.5 text-white/60" />
                            </Select.ItemIndicator>
                        </Select.Item>
                    ))}
                </Select.Viewport>
            </Select.Content>
        </Select.Root>
    )
}
