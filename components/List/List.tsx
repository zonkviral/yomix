interface ListProps<T> {
    list: T[]
    renderItem: (item: T, index: number) => React.ReactNode
    className?: string
    listClassName?: string
    keyExtractor: (item: T) => string
}

export const List = <T,>({
    className,
    list,
    renderItem,
    listClassName,
    keyExtractor,
}: ListProps<T>) => {
    return (
        <ul className={className}>
            {list.map((item, index) => (
                <li key={keyExtractor(item)} className={listClassName}>
                    {renderItem(item, index)}
                </li>
            ))}
        </ul>
    )
}
