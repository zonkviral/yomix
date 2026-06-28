import { UserDropdownMenu } from "./UserDropdownMenu"
import { NotificationMenu } from "./NotificationMenu"

import { Profile } from "@/lib/supabase/type"

interface UserMenuProps {
    profile: Profile
}

export const UserMenu = ({ profile }: UserMenuProps) => {
    return (
        <div className="ml-auto flex gap-3 select-none">
            <NotificationMenu />
            <UserDropdownMenu profile={profile} />
        </div>
    )
}
