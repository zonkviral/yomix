import { Bookmark, HomeIcon } from "lucide-react"
import Link from "next/link"

const navItems = [
    { title: "Discover", icon: HomeIcon, href: "/discover" },
    { title: "Bookmarks", icon: Bookmark, href: "/bookmarks" },
]

export const Nav = () => {
    const navRender = () =>
        navItems.map((item, id) => {
            const Icon = item.icon
            return (
                <li key={id}>
                    <Link
                        className="hover:bg-secondary flex items-center gap-3 p-3 pl-6"
                        href={item.href}
                    >
                        <Icon />
                        <span>{item.title}</span>
                    </Link>
                </li>
            )
        })
    return (
        <nav className="bg-surface border-primary border-r pt-7">
            <ul className="list-none items-center text-xl">{navRender()}</ul>
        </nav>
    )
}
