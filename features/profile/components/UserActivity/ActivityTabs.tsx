import { RadioGroup } from "@/components/ui/RadioGroup/RadioGroup"
import { RadioTab } from "@/components/ui/RadioTab/RadioTab"

const PERIODS = [
    { value: "week", label: "Неделя" },
    { value: "month", label: "Месяц" },
    { value: "year", label: "Год" },
] as const

interface ActivityTabsProps {
    period: "week" | "month" | "year"
    setPeriod: (period: "week" | "month" | "year") => void
}

export const ActivityTabs = ({ period, setPeriod }: ActivityTabsProps) => {
    return (
        <RadioGroup
            variant="fill"
            className="rounded-xl bg-[#1a1524bf]/70 text-neutral-300"
            indicatorClassName="bg-rose-800/60 rounded-xl"
            activeIndex={PERIODS.findIndex((filter) => filter.value === period)}
        >
            {PERIODS.map((filter) => (
                <RadioTab
                    className="p-1 text-sm"
                    key={filter.value}
                    value={filter.value}
                    name="activity-filter"
                    checked={period === filter.value}
                    onChange={() => setPeriod(filter.value)}
                    label={filter.label}
                />
            ))}
        </RadioGroup>
    )
}
