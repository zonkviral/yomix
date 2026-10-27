import Link from "next/link"
import Image from "next/image"

import { SearchBar } from "@/features/search/SearchBar"
import { Auth } from "@/features/auth/components/Auth"
import { LanguageToggle } from "@/features/i18n/components/LanguageToggle"

import { UserMenu } from "@/components/layout/UserMenu/UserMenu"

import type { User } from "@supabase/supabase-js"

import { Profile } from "@/lib/supabase/type"
import { getSystemLang } from "@/lib/i18n/getSystemLang"

interface HeaderProps {
    user: User | null
    profile: Profile | null
}

export const Header = async ({ user, profile }: HeaderProps) => {
    const systemLang = await getSystemLang()
    return (
        <header className="bg-surface border-primary col-span-2 row-start-1 flex items-center rounded-t-sm border-b-[0.5px] px-5 py-1">
            <div className="mt-1 mr-10 h-10 w-37.5">
                <Link href="/" className="relative">
                    <Image src="/logo.svg" fill sizes="200" alt="logo" loading="eager" />
                    <h1 className="text-0 invisible text-4xl uppercase">Yomix</h1>
                </Link>
            </div>
            <SearchBar />
            <LanguageToggle current={systemLang} />
            {user && profile ? <UserMenu profile={profile} /> : <Auth />}
        </header>
    )
}
