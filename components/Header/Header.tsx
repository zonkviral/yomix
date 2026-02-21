import { Permanent_Marker } from "next/font/google"

import Image from "next/image"
import Link from "next/link"

const permanentMarker = Permanent_Marker({
    subsets: ["latin"],
    weight: "400",
})

export const Header = () => (
    <header className="bg-surface border-primary col-span-2 row-start-1 flex rounded-t-sm border-b-[0.5px] px-5 py-1">
        <div className="w-[150px].5 mt-1 mr-10 h-10">
            <Link href="/" className="relative">
                <Image
                    src="/logo.svg"
                    fill
                    sizes="200"
                    alt="logo"
                    loading="eager"
                />
                <h1
                    className={`${permanentMarker.className} text-0 invisible text-4xl uppercase`}
                >
                    Yomix
                </h1>
            </Link>
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
