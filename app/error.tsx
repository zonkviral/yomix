"use client"

import { ErrorView } from "@/components/ErrorView/ErrorView"

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    return <ErrorView error={error} reset={reset} />
}
