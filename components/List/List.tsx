interface ListProps<T> {
    list: T[]
    renderItem: (item: T, index: number) => React.ReactNode
    className?: string
    listClassName?: string
}

export const List = <T,>({
    className,
    list,
    renderItem,
    listClassName,
}: ListProps<T>) => {
    return (
        <ul className={className}>
            {list.map((item, index) => (
                <li key={index} className={listClassName}>
                    {renderItem(item, index)}
                </li>
            ))}
        </ul>
    )
}
