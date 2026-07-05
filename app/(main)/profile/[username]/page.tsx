import { AboutMe } from "@/features/profile/components/AboutMe"
import { CollectionSection } from "@/features/profile/components/CollectionSection"
import { ProfileHeader } from "@/features/profile/components/ProfileHeader"
import { UserActivity } from "@/features/profile/components/UserActivity/UserActivity"
import { RecentBookmarks } from "@/features/profile/components/RecentBookmarks"

const ProfilePage = async () => {
    return (
        <div className="grid w-full grid-cols-[auto_1fr] grid-rows-[auto_1fr] gap-3 px-3 py-5 md:grid-cols-[65rem_1fr] md:grid-rows-[auto_1fr]">
            <ProfileHeader />
            <div className="flex flex-col gap-3">
                <CollectionSection />
                <RecentBookmarks />
            </div>
            <div className="flex flex-col gap-3">
                <AboutMe />
                <UserActivity />
            </div>
        </div>
    )
}

export default ProfilePage
