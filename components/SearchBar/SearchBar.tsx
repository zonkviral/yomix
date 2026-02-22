"use client"
import { useState } from "react"
import { Search, X } from "lucide-react"

export default function SearchBar() {
    const [open, setOpen] = useState(false)

    return (
        <>
            <button
                className="ml-auto justify-items-center md:hidden"
                onClick={() => setOpen(true)}
            >
                <Search size={30} />
            </button>
            {open && (
                <div className="fixed inset-0 z-50 bg-gray-900 p-4 md:hidden">
                    <div className="flex items-center gap-3">
                        <input
                            autoFocus
                            placeholder="Search manga..."
                            className="w-full rounded border border-gray-600 bg-gray-800 p-2 outline-none"
                            type="search"
                        />
                        <button onClick={() => setOpen(false)}>
                            <X size={20} />
                        </button>
                    </div>
                </div>
            )}
            <form className="relative hidden items-center md:flex">
                <Search
                    size={23}
                    className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
                />
                <label htmlFor="search-manga" className="sr-only">
                    Search manga
                </label>
                <input
                    placeholder="Search manga..."
                    className="border-primary rounded-sm border p-2 pl-10 outline-none"
                    type="search"
                    name="search-manga"
                    id="search-manga"
                />
            </form>
        </>
    )
}
