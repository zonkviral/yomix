import { DetailsTable } from "@/components/ui/DetailsTable/DetailsTable"
import { SectionCard } from "@/components/ui/SectionCard/SectionCard"

const tableData = [
    {
        label: "Любимые жанры:",
        value: "psyhology, drama, seinen, shounen",
    },
    {
        label: "Любимые авторы:",
        value: "Inio Asano, Hajime Isayama, Naoki Urasawa",
    },
    {
        label: "Любимая манга:",
        value: "Monster",
    },
]

export const AboutMe = () => {
    return (
        <SectionCard className="h-fit" title="Обо мне">
            <DetailsTable data={tableData} className="py-5 *:justify-between *:py-1" />
            {/* любимая цитата */}
            <div className="rounded-md border border-violet-950/20 bg-[#1a1524bf]/10 p-4 text-sm text-neutral-100 shadow-md shadow-black/20 backdrop-blur-xl">
                <div className="flex items-start gap-3">
                    <span className="text-xl leading-none text-white/40">❝</span>
                    <p>
                        Манга - это искусство, которое позволяет нам погрузиться в другие миры и
                        пережить невероятные приключения.
                    </p>
                    <span className="text-xl leading-none text-white/40">❞</span>
                </div>
            </div>
        </SectionCard>
    )
}
