import { useAuth } from "@/context/AuthContext"
import { logoutClient } from "@/features/auth/services/auth.service"

export const UserMenu = () => {
    const { username } = useAuth()
    const handleLogout = async () => {
        await logoutClient()
    }
    return (
        <div className="ml-auto flex">
            <div>Welcome, {username}!</div>
            <button type="button" onClick={handleLogout}>
                Logout
            </button>
        </div>
    )
}
