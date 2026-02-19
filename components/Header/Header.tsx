import { Permanent_Marker } from "next/font/google";

const permanentMarker = Permanent_Marker({
    subsets: ["latin"],
    weight: "400",
});

export const Header = () => (
    <header className="flex rounded-t-sm bg-surface py-1 px-5 col-span-2 border-b-[0.5px] border-primary">
        <h1 className={`${permanentMarker.className} uppercase text-4xl`}>
            Manga
        </h1>
        <form className="self-center pl-3">
            <input
                placeholder="Search manga..."
                className="border rounded-sm border-primary p-2"
                type="search"
                name="search-manga"
                id="search-manga"
            />
        </form>
    </header>
);
