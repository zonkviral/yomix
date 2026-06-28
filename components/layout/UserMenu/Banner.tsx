import { BannerIcon } from "@/components/layout/UserMenu/BannerIcon"

import { getAvatarUrl } from "@/features/auth/services/avatar"

import { Profile } from "@/lib/supabase/type"

import Image from "next/image"

export const Banner = ({ profile }: { profile: Profile }) => {
    const src = getAvatarUrl(profile)

    return (
        <div className="border-b-0.5 relative overflow-hidden border-neutral-700 bg-[#0d0d0d] py-2.5">
            <BannerIcon />
            <div className="relative z-10 flex h-full items-center gap-2.5 px-3.5">
                <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-rose-800 bg-[#0d0d0d] shadow-[0px_0px_2px_2px_#6e1313]">
                    <Image
                        src={src}
                        alt="avatar"
                        fill
                        className="object-cover"
                        unoptimized
                    />
                </div>
                <div className="flex flex-col gap-0.5">
                    <span className="text-base leading-tight font-medium text-white">
                        {profile.username}
                    </span>
                    <span className="text-sm text-white/40">
                        @{profile.username}
                    </span>
                </div>
                {/* <div className="mt-0.5 inline-flex w-fit items-center gap-1 rounded-xs border border-rose-600/40 bg-rose-600/10 px-1.5 py-px">
                    <Crown className="h-2.5 w-2.5 text-rose-500" />
                    <span className="text-xs font-medium text-rose-500">
                        Free
                    </span>
                </div> */}
            </div>
        </div>
    )
}
