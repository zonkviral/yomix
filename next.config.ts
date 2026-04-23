import type { NextConfig } from "next"

const uploadUrl = new URL(process.env.MANGADEX_UPLOADS_URL!)
const baseUrl = new URL(process.env.MANGADEX_BASE_URL!)
const remangaUrl = new URL(process.env.REMANGA_URL!)
const remangaImgUrl = new URL(process.env.REMANGA_IMG_URL!)

const nextConfig: NextConfig = {
    images: {
        localPatterns: [{ pathname: "/**" }],
        remotePatterns: [
            {
                hostname: baseUrl.hostname,
            },
            { hostname: "flagcdn.com" },
            { hostname: "*.mangadex.network" },
            { hostname: uploadUrl.hostname },
            { hostname: remangaUrl.hostname },
            { hostname: remangaImgUrl.hostname },
        ],
    },
    allowedDevOrigins: ["192.168.1.33"],
}

export default nextConfig
