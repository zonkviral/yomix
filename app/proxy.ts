import { type NextRequest } from "next/server"

import { updateSession } from "@/lib/supabase/proxy"

const CIS_COUNTRIES = new Set([
    "RU",
    "BY",
    "KZ",
    "KG",
    "TJ",
    "UZ",
    "AM",
    "AZ",
    "MD",
    "UA",
    "GE",
    "TM",
])

export async function proxy(request: NextRequest) {
    let lang = request.cookies.get("system_lang")?.value
    const isFirstVisit = !lang

    if (!lang) {
        const country = request.headers.get("x-vercel-ip-country")
        lang = country && CIS_COUNTRIES.has(country) ? "ru" : "en"
        request.cookies.set("system_lang", lang)
    }

    const response = await updateSession(request)

    if (isFirstVisit) {
        response.cookies.set("system_lang", lang, { maxAge: 60 * 60 * 24 * 365, path: "/" }) // saved in the browser
    }

    return response
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
