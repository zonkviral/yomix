import { Bookmark, HomeIcon } from "lucide-react";

export const Nav = () => (
    <nav className="bg-surface pl-2 border-r border-primary">
        <ul className="list-none text-xl items-center">
            <li className="flex p-3">
                <HomeIcon />
                <a className="pl-3" href="/bookmarks">
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
);
