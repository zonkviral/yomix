import { memo } from "react"

interface ListProps<T> {
    items: T[]
    renderItem: (item: T, index: number) => React.ReactNode
    className?: string
    listClassName?: string
    keyExtractor?: (item: T) => string
}

const ListInner = <T,>({
    className,
    items: list,
    renderItem,
    listClassName,
    keyExtractor,
}: ListProps<T>) => {
    return (
        <ul className={className}>
            {list.map((item, index) => (
                <li
                    key={keyExtractor ? keyExtractor(item) : index}
                    className={listClassName}
                >
                    {renderItem(item, index)}
                </li>
            ))}
        </ul>
    )
}

export const List = memo(ListInner) as typeof ListInner
