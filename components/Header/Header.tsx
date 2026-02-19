import { Permanent_Marker } from "next/font/google"

import Image from "next/image"

const permanentMarker = Permanent_Marker({
    subsets: ["latin"],
    weight: "400",
})

export const Header = () => (
    <header className="bg-surface border-primary col-span-2 flex rounded-t-sm border-b-[0.5px] px-5 py-1">
        <div className="w-[150px].5 relative mt-1 mr-10 h-10">
            <Image src="/logo.png" fill sizes="200" alt="logo" />
            <h1
                className={`${permanentMarker.className} text-0 invisible text-4xl uppercase`}
            >
                Yomix
            </h1>
        </div>
        <form className="self-center pl-3">
            <input
                placeholder="Search manga..."
                className="border-primary rounded-sm border p-2"
                type="search"
                name="search-manga"
                id="search-manga"
            />
        </form>
    </header>
)
