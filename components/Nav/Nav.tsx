import { Bookmark, HomeIcon } from "lucide-react"

export const Nav = () => (
    <nav className="bg-surface border-primary border-r pl-2">
        <ul className="list-none items-center text-xl">
            <li className="flex p-3">
                <HomeIcon />
                <a className="pl-3" href="/discover">
                    Discover
                </a>
            </li>
            <li className="flex p-3">
                <Bookmark />
                <a className="pl-3" href="/bookmarks">
                    Bookmarks
                </a>
            </li>
        </ul>
    </nav>
)
