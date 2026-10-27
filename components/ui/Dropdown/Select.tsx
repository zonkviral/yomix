"use client"

import * as React from "react"

import * as SelectPrimitive from "@radix-ui/react-select"

import { ChevronDown, Check } from "lucide-react"

import { cn } from "@/utils/cn"

import {
    dropdownTriggerStyles,
    dropdownContentStyles,
    dropdownItemStyles,
    dropdownChevronStyles,
} from "./dropdown-styles"

export interface SelectOption<T extends string = string> {
    value: T
    label: React.ReactNode
}

interface SelectProps<T extends string = string> {
    value?: T
    onValueChange: (value: T) => void
    options: SelectOption<T>[]
    placeholder?: string
    disabled?: boolean
    onOpenChange?: (open: boolean) => void
    triggerClassName?: string
    side?: "top" | "bottom" | "left" | "right"
}

export function Select<T extends string = string>({
    value,
    onValueChange,
    options,
    placeholder = "—",
    disabled,
    onOpenChange,
    triggerClassName,
    side = "top",
}: SelectProps<T>) {
    const current = options.find((o) => o.value === value)

    return (
        <SelectPrimitive.Root
            value={value}
            onValueChange={onValueChange}
            onOpenChange={onOpenChange}
            disabled={disabled}
        >
            <SelectPrimitive.Trigger className={cn(dropdownTriggerStyles, triggerClassName)}>
                <SelectPrimitive.Value>{current?.label ?? placeholder}</SelectPrimitive.Value>
                <SelectPrimitive.Icon>
                    <ChevronDown className={dropdownChevronStyles} />
                </SelectPrimitive.Icon>
            </SelectPrimitive.Trigger>

            <SelectPrimitive.Content
                position="popper"
                side={side}
                align="center"
                sideOffset={1}
                className={dropdownContentStyles}
            >
                <SelectPrimitive.Viewport className="p-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {options.map((option) => (
                        <SelectPrimitive.Item
                            key={option.value}
                            value={option.value}
                            className={dropdownItemStyles}
                        >
                            <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
                            <SelectPrimitive.ItemIndicator className="absolute right-2">
                                <Check className="w-3.5 text-white/60" />
                            </SelectPrimitive.ItemIndicator>
                        </SelectPrimitive.Item>
                    ))}
                </SelectPrimitive.Viewport>
            </SelectPrimitive.Content>
        </SelectPrimitive.Root>
    )
}
