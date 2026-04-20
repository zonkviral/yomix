import { GoogleIcon } from "@/components/icons/GoogleIcon"
import { DiscordIcon } from "@/components/icons/DiscordIcon"

export const OAuthButtons = ({ label }: { label: string }) => (
    <div className="flex flex-col gap-2 text-white">
        <button
            type="button"
            className="flex items-center gap-2 rounded border border-rose-600/70 px-4 py-2 hover:bg-white/5"
        >
            <GoogleIcon />
            {label} with <span className="font-bold">Google</span>
        </button>
        <button
            type="button"
            className="flex items-center gap-2 rounded border border-rose-600/70 px-4 py-2 hover:bg-white/5"
        >
            <DiscordIcon />
            {label} with <span className="font-bold">Discord</span>
        </button>
    </div>
)
