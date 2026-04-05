import type { Metadata } from "next"
import { Inter, Nunito } from "next/font/google"

import "./globals.css"
import { AuthProvider } from "@/context/AuthContext"

export const metadata: Metadata = {
    title: "Manga",
    description: "manga reader",
    keywords: ["read", "mangareader", "manga"],
}

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const nunito = Nunito({ subsets: ["latin"], variable: "--font-nunito" })

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en" className={`${inter.variable} ${nunito.variable}`}>
            <body>
                <AuthProvider>{children}</AuthProvider>
            </body>
        </html>
    )
}
