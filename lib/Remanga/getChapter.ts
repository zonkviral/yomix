export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const url = searchParams.get("url")

    if (!url) {
        return new Response("Missing url", { status: 400 })
    }

    const res = await fetch(url, {
        headers: {
            Referer: "https://remanga.org/",
            Origin: "https://remanga.org",
            "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
            Accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9",
            Connection: "keep-alive",
        },
    })

    if (!res.ok) {
        return new Response(`Failed ${res.status}`, { status: res.status })
    }

    return new Response(res.body, {
        headers: {
            "Content-Type": res.headers.get("Content-Type") ?? "image/jpeg",
            "Cache-Control": "public, max-age=31536000, immutable",
        },
    })
}
