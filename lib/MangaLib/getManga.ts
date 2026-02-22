import { MANGALIB_URL } from "./constants"

export const getMangaLib = async (slug: string) => {
    const res = await fetch(`${MANGALIB_URL}api/manga?search=${slug}`, {
        headers: {
            Accept: "application/json",
            Referer: "https://mangalib.me",
            Origin: "https://mangalib.me",
            "User-Agent": "Mozilla/5.0 ...",
        },
    })
    console.log(res)
    const data = await res.json()
    return data
}
