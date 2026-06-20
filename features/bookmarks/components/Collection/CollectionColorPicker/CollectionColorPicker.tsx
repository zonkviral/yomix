import { RadioTab } from "@/components/ui/RadioTab/RadioTab"

import { cn } from "@/utils/cn"

import { COLLECTION_COLORS } from "../../../constants/collection-colors"

interface ColorPickerProps {
    value: string
    onChange: (id: string) => void
}

export const CollectionColorPicker = ({
    value,
    onChange,
}: ColorPickerProps) => (
    <div className="flex flex-wrap gap-2">
        {COLLECTION_COLORS.map((color) => (
            <RadioTab
                key={color.id}
                label={color.id}
                value={color.id}
                name="collection-color"
                checked={value === color.id}
                onChange={() => onChange(color.id)}
                renderOption={(checked) => (
                    <span
                        className={cn(
                            "flex h-7 w-7 rounded-full transition-transform hover:scale-110",
                            checked && "scale-110 ring-2 ring-blue-600",
                        )}
                        style={{ backgroundColor: color.preview }}
                    />
                )}
            />
        ))}
    </div>
)
