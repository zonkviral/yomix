import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get("code")

    if (code) {
        const supabase = await createClient()
        const { error } = await supabase.auth.exchangeCodeForSession(code)

        if (error) {
            // redirect to login with error if exchange fails
            return NextResponse.redirect(`${origin}/?error=auth`)
        }
    }

    return NextResponse.redirect(`${origin}/`)
}
