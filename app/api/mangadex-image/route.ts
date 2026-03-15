export const GET = async (req: Request) => {
    const { searchParams } = new URL(req.url)
    const url = searchParams.get("url")

    if (!url) {
        return new Response("Missing url param", { status: 400 })
    }
    try {
        const parsed = new URL(url)
        const hostname = parsed.hostname
        const allowed =
            hostname === "mangadex.org" ||
            hostname.endsWith(".mangadex.org") ||
            hostname.endsWith(".mangadex.network")

        if (!allowed) {
            return new Response("Forbidden", { status: 403 })
        }
    } catch {
        return new Response("Invalid url", { status: 400 })
    }

    try {
        const res = await fetch(url, {
            headers: {
                Referer: "https://mangadex.org/",
                Origin: "https://mangadex.org",
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
                Accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
            },
        })

        if (!res.ok) {
            return new Response(`Upstream error: ${res.status}`, {
                status: res.status,
            })
        }

        const contentType = res.headers.get("Content-Type") ?? ""

        if (!contentType.startsWith("image/")) {
            console.warn(
                `[mangadex-image] Non-image response for ${url}: ${contentType}`,
            )
            return new Response("Upstream returned non-image content", {
                status: 502,
            })
        }

        return new Response(res.body, {
            headers: {
                "Content-Type": contentType,
                "Cache-Control": "public, max-age=31536000, immutable",
                "X-Content-Type-Options": "nosniff",
                "Access-Control-Allow-Origin": "*",
            },
        })
    } catch {
        return new Response("Failed to fetch image", { status: 502 })
    }
}
