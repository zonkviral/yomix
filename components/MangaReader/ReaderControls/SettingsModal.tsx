"use client"

import { IconButton } from "@/components/IconButton/IconButton"
import { RadioGroup } from "@/components/RadioGroup/RadioGroup"
import { RadioTab } from "@/components/RadioTab/RadioTab"
import { useReader } from "../ReaderContext"
import type { ReadingMode, ReaderFilter, ReaderBgColor } from "../ReaderContext"

import {
    BG_COLOR_MAP,
    BG_COLORS,
    FILTER_OPTIONS,
    READING_MODES,
} from "../constants"

import { X } from "lucide-react"

interface Props {
    onClose: () => void
}

export const SettingsModal = ({ onClose }: Props) => {
    const {
        readingMode,
        setReadingMode,
        filter,
        setFilter,
        bgColor,
        setBgColor,
    } = useReader()

    const readingModeIndex = READING_MODES.findIndex(
        (m) => m.value === readingMode,
    )
    const filterIndex = FILTER_OPTIONS.findIndex((f) => f.value === filter)

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-white/80">
                    Settings
                </span>
                <IconButton onClick={onClose}>
                    <X className="w-5" />
                </IconButton>
            </div>

            <div className="h-px bg-white/10" />

            <fieldset className="flex flex-col gap-2">
                <legend className="pl-1 text-sm text-white/40">
                    Reading mode
                </legend>
                <div className="mt-1">
                    <RadioGroup activeIndex={readingModeIndex}>
                        {READING_MODES.map((mode) => (
                            <RadioTab
                                key={mode.value}
                                label={mode.label}
                                value={mode.value}
                                name="reading-mode"
                                checked={readingMode === mode.value}
                                onChange={() =>
                                    setReadingMode(mode.value as ReadingMode)
                                }
                                className="flex-1 text-center"
                            />
                        ))}
                    </RadioGroup>
                </div>
            </fieldset>

            <div className="h-px bg-white/10" />

            <fieldset className="flex flex-col gap-1">
                <legend className="pl-1 text-sm text-white/40">
                    Color filter
                </legend>
                <div className="mt-1">
                    <RadioGroup activeIndex={filterIndex}>
                        {FILTER_OPTIONS.map((f) => (
                            <RadioTab
                                key={f.value}
                                label={f.label}
                                value={f.value}
                                name="color-filter"
                                checked={filter === f.value}
                                onChange={() =>
                                    setFilter(f.value as ReaderFilter)
                                }
                                className="flex-1 text-center"
                            />
                        ))}
                    </RadioGroup>
                </div>
            </fieldset>

            <div className="h-px bg-white/10" />

            <fieldset className="flex flex-col gap-2">
                <legend className="pl-1 text-sm text-white/40">
                    Background
                </legend>
                <div className="mt-1 flex items-center gap-2">
                    {BG_COLORS.map((bg) => (
                        <RadioTab
                            key={bg.value}
                            label={bg.label}
                            value={bg.value}
                            name="bg-color"
                            checked={bgColor === bg.value}
                            onChange={() =>
                                setBgColor(bg.value as ReaderBgColor)
                            }
                            renderOption={(checked) => (
                                <span
                                    className={`block h-6 w-6 rounded-full border transition-all duration-200 hover:scale-110 ${
                                        checked
                                            ? "scale-110 border-rose-900"
                                            : "border-white/20 hover:border-white/60"
                                    }`}
                                    style={{
                                        backgroundColor:
                                            BG_COLOR_MAP[
                                                bg.value as ReaderBgColor
                                            ],
                                    }}
                                    title={bg.label}
                                />
                            )}
                        />
                    ))}
                </div>
            </fieldset>
        </div>
    )
}
