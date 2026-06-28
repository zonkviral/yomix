import { Nav } from "@/components/layout/Nav/Nav"
import { Header } from "@/components/layout/Header/Header"

import { createClient } from "@/lib/supabase/server"
import { getProfile } from "@/lib/supabase/queries/profile"

const RootLayout = async ({
    children,
}: Readonly<{ children: React.ReactNode }>) => {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    const profile = user ? await getProfile(user.id) : null

    return (
        <div className="grid min-h-screen w-full grid-cols-1 grid-rows-[60px_1fr_60px] md:grid-cols-[10rem_1fr] md:grid-rows-[60px_1fr]">
            <Header user={user} profile={profile} />
            <Nav />
            <main className="bg-app -mt-px overflow-hidden px-7 py-8 inset-shadow-[1px_0px_6px_0px_black]">
                {children}
            </main>
        </div>
    )
}
export default RootLayout
