interface DetailsTableItem {
    label: string
    value: React.ReactNode
}

interface DetailsTableProps {
    data: DetailsTableItem[]
    className?: string
}

export const DetailsTable = ({ className, data }: DetailsTableProps) => {
    return (
        <dl className={`${className} flex flex-col gap-1`}>
            {data.map((item) => (
                <div className="flex gap-2" key={item.label}>
                    <dt className="min-w-28 text-gray-400 capitalize">
                        {item.label}
                    </dt>
                    <dd className="flex flex-wrap items-center gap-2 capitalize">
                        {item.value}
                    </dd>
                </div>
            ))}
        </dl>
    )
}
