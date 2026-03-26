import { GoogleIcon } from "@/components/Icons/GoogleIcon"
import { DiscordIcon } from "@/components/Icons/DiscordIcon"

export const OAuthButtons = ({ label }: { label: string }) => (
    <div className="flex flex-col gap-2 text-white">
        <button className="flex items-center gap-2 rounded border border-rose-600/70 px-4 py-2 hover:bg-white/5">
            <GoogleIcon />
            {label} with <span className="font-bold">Google</span>
        </button>
        <button className="flex items-center gap-2 rounded border border-rose-600/70 px-4 py-2 hover:bg-white/5">
            <DiscordIcon />
            {label} with <span className="font-bold">Discord</span>
        </button>
    </div>
)
