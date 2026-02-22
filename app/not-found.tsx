import Link from "next/link"

export default function NotFound() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4">
            <h1 className="text-4xl font-bold">404</h1>
            <p className="text-gray-400">This manga doesn't exist</p>
            <Link
                href="/"
                className="rounded bg-rose-800 px-4 py-2 hover:bg-rose-700"
            >
                Go home
            </Link>
        </div>
    )
}
