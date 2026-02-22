interface InfoItem {
    label: string
    value: React.ReactNode
}

interface InfoItemListProps {
    data: InfoItem[]
    className?: string
}

export const InfoItemList = ({ className, data }: InfoItemListProps) => {
    return (
        <dl className={`${className} flex flex-col gap-1`}>
            {data.map((item) => (
                <div className="flex gap-2" key={item.label}>
                    <dt className="min-w-28 text-gray-400 capitalize">
                        {item.label}
                    </dt>
                    <dd className="capitalize">{item.value}</dd>
                </div>
            ))}
        </dl>
    )
}
