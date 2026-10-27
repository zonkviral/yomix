import "server-only"

import { cookies } from "next/headers"

export async function getSystemLang(): Promise<string> {
    const value = (await cookies()).get("system_lang")?.value
    return value && /^[a-z]{2,3}$/.test(value) ? value : "en"
}
