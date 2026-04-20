import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import { logout } from "@/actions/validation.action"

export const UserMenu = () => {
    const { username, refreshAuth } = useAuth()
    const router = useRouter()
    const handleLogout = async () => {
        await logout()
        await refreshAuth()
        router.refresh()
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
