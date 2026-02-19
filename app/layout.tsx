import type { Metadata } from "next"
import { Inter, Nunito } from "next/font/google"

import { Nav } from "@/components/Nav/Nav"
import { Header } from "@/components/Header/Header"

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
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en" className={`${inter.variable} ${nunito.variable}`}>
            <body>
                <div className="grid grid-cols-[12rem_1fr] grid-rows-[60px_1fr]">
                    <Header />
                    <Nav />
                    <main className="bg-[#111319] -mt-px pt-8 px-7 inset-shadow-[1px_0px_6px_0px_black] overflow-hidden">
                        {children}
                    </main>
                </div>
            </body>
        </html>
    )
}
