/* eslint-disable no-console */
"use client"
import { useEffect } from "react"

import Image from "next/image"
import Link from "next/link"

export const ErrorView = ({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) => {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#111319] px-6 text-white">
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="h-125 w-125 rounded-full bg-rose-900/20 blur-[120px]" />
            </div>
            <div className="relative z-10 mb-8 h-64 w-64 drop-shadow-[0_0_40px_rgba(136,19,55,0.6)]">
                <Image
                    src="/error.png"
                    alt="Error"
                    fill
                    className="object-contain"
                />
            </div>
            <div className="relative z-10 flex flex-col items-center gap-3 text-center">
                <span className="text-sm font-semibold tracking-[0.3em] text-rose-500 uppercase">
                    Something went wrong
                </span>

                <h1 className="text-5xl font-black tracking-tight text-white">
                    Error
                    <span className="text-rose-500">.</span>
                </h1>

                <p className="mt-2 max-w-sm text-sm leading-relaxed text-gray-400">
                    {error.message ||
                        "An unexpected error occurred. Please try again."}
                </p>
                <div className="mt-6 flex gap-3">
                    <button
                        onClick={reset}
                        className="rounded bg-rose-800 px-6 py-2 text-sm font-semibold shadow-md shadow-rose-900/50 transition hover:bg-rose-700 hover:shadow-lg hover:shadow-rose-900/70"
                    >
                        Try again
                    </button>
                    <Link
                        href="/"
                        className="rounded bg-gray-700 px-6 py-2 text-sm font-semibold shadow-md shadow-gray-900/50 transition hover:bg-gray-600 hover:shadow-lg"
                    >
                        Go home
                    </Link>
                </div>
                {error.digest && (
                    <p className="mt-4 text-xs text-gray-600">
                        Error ID: {error.digest}
                    </p>
                )}
            </div>
        </div>
    )
}
