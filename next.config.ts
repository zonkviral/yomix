import type { NextConfig } from "next"

const uploadUrl = new URL(process.env.MANGADEX_UPLOADS_URL!)
const baseUrl = new URL(process.env.MANGADEX_BASE_URL!)

const nextConfig: NextConfig = {
    /* config options here */
    images: {
        remotePatterns: [
            {
                hostname: baseUrl.hostname,
            },
            { hostname: uploadUrl.hostname },
        ],
    },
}

export default nextConfig
