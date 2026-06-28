import type { Metadata } from "next"
import { Inter, Nunito } from "next/font/google"

import { AuthListener } from "@/features/auth/components/AuthListener"

import "./globals.css"

export const metadata: Metadata = {
    title: "Manga",
    description: "manga reader",
    keywords: ["read", "mangareader", "manga"],
}

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const nunito = Nunito({ subsets: ["latin"], variable: "--font-nunito" })

export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html
            lang="en"
            className={`${inter.variable} ${nunito.variable}`}
            suppressHydrationWarning
        >
            <body>
                {children}
                <AuthListener />
            </body>
        </html>
    )
}
