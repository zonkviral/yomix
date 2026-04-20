import { tagTranslationMap } from "@/lib/MangaDex/mappings/tagTranslationMap"
import { cn } from "@/utils/cn"

type Tag = {
    attributes: {
        name: Record<string, string>
    }
}

export const TagsList = ({
    tags,
    limit = 6,
    className,
    itemsClassName,
}: {
    tags: Tag[]
    limit?: number
    className?: string
    itemsClassName?: string
}) => {
    const visible = tags.slice(0, limit)
    const remaining = tags.length - limit

    return (
        <ul className={cn("mt-3 flex list-none flex-wrap gap-1", className)}>
            {visible.map((tag, id) => (
                <li
                    key={id}
                    className={cn(
                        "bg-secondary rounded-sm px-4 capitalize",
                        itemsClassName,
                    )}
                >
                    {tag.attributes.name["ru"] ??
                        tagTranslationMap[tag.attributes.name["en"]] ??
                        tag.attributes.name["en"]}
                </li>
            ))}
            {remaining > 0 && (
                <li className="mt-1 text-xs text-white/30">+{remaining}</li>
            )}
        </ul>
    )
}
