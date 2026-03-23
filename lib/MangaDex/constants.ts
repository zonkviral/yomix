export const BASE_URL = process.env.MANGADEX_BASE_URL
export const UPLOADS_BASE_URL = process.env.MANGADEX_UPLOADS_URL

export const status = {
    ongoing: "bg-blue-500/70",
    completed: "bg-emerald-600/70",
    hiatus: "bg-amber-500/70",
    cancelled: "bg-red-600/70",
}

export const contentRating = {
    safe: ["12+", "bg-green-500/80"],
    suggestive: ["16+", "bg-yellow-500/80"],
    erotica: ["18+", "bg-red-600/80"],
    pornographic: ["18+", "bg-red-600/80"],
}
