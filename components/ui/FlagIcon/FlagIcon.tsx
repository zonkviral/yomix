import Image from "next/image"

import { getFlagUrl } from "@/utils/langToFlag"

export const FlagIcon = ({ lang }: { lang: string }) => {
    const flagUrl = getFlagUrl(lang)

    return (
        <div className="relative h-4.5 w-6" title={lang}>
            <Image src={flagUrl} alt="flag" fill sizes="24px" />
        </div>
    )
}
