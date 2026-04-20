"use client"
import { SearchBar } from "@/features/search/SearchBar"
import { Auth } from "@/features/auth/components/Auth"

import { UserMenu } from "@/components/layout/UserMenu/UserMenu"

import { useAuth } from "@/context/AuthContext"

import Link from "next/link"
import Image from "next/image"

export const Header = () => {
    const { user, username } = useAuth()

    return (
        <header className="bg-surface border-primary col-span-2 row-start-1 flex items-center rounded-t-sm border-b-[0.5px] px-5 py-1">
            <div className="mt-1 mr-10 h-10 w-37.5">
                <Link href="/" className="relative">
                    <Image
                        src="/logo.svg"
                        fill
                        sizes="200"
                        alt="logo"
                        loading="eager"
                    />
                    <h1 className="text-0 invisible text-4xl uppercase">
                        Yomix
                    </h1>
                </Link>
            </div>
            <SearchBar />
            {user && username ? <UserMenu /> : <Auth />}
        </header>
    )
}
