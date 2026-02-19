import type { NextConfig } from "next"

const nextConfig: NextConfig = {
    /* config options here */
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "uploads.mangadex.org",
            },
            {
                protocol: "https",
                hostname: "external-content.duckduckgo.com",
            },
        ],
    },
}

export default nextConfig
