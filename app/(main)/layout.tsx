import { Nav } from "@/components/layout/Nav/Nav"
import { Header } from "@/components/layout/Header/Header"

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <div className="grid min-h-screen w-full grid-cols-1 grid-rows-[60px_1fr_60px] md:grid-cols-[12rem_1fr] md:grid-rows-[60px_1fr]">
            <Header />
            <Nav />
            <main className="bg-app -mt-px overflow-hidden px-7 py-8 inset-shadow-[1px_0px_6px_0px_black]">
                {children}
            </main>
        </div>
    )
}
