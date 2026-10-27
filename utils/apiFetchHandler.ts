import { notFound } from "next/navigation"

export class ApiError extends Error {
    constructor(
        message: string,
        public status: number,
    ) {
        super(message)
        this.name = "ApiError"
    }
}

type RetryOptions = {
    retries?: number
    baseDelayMs?: number
    maxDelayMs?: number
    retryOn?: number[]
    // Default: a 404 shows Next's not-found page (pages).
    // Set true in server actions / background code to get an ApiError(404) instead.
    throwOnNotFound?: boolean
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

const calcBackoff = (base: number, attempt: number, max: number) => {
    const exp = Math.min(base * 2 ** attempt, max)
    return Math.floor(exp * (0.5 + Math.random() * 0.5))
}

const fetchWithRetry = async <T>(
    url: string,
    options?: RequestInit,
    retryOptions?: RetryOptions,
): Promise<T> => {
    const {
        retries = 3,
        baseDelayMs = 500,
        maxDelayMs = 5000,
        retryOn = [429, 503],
    } = retryOptions || {}

    for (let attempt = 0; attempt <= retries; attempt++) {
        let res: Response
        try {
            res = await fetch(url, options)
        } catch (err) {
            if (options?.signal?.aborted) throw err // the caller cancelled, don't retry
            if (attempt < retries) {
                await sleep(calcBackoff(baseDelayMs, attempt, maxDelayMs))
                continue
            }
            throw new ApiError("Network error", 503)
        }

        if (res.ok) {
            try {
                return (await res.json()) as T
            } catch {
                throw new ApiError("Invalid response from server", 502)
            }
        }

        if (res.status === 404) throw new ApiError("Not found", 404)

        if (retryOn.includes(res.status) && attempt < retries) {
            await sleep(calcBackoff(baseDelayMs, attempt, maxDelayMs))
            continue
        }

        throw new ApiError(
            res.status === 429
                ? "Rate limited"
                : res.status === 503
                  ? "Service unavailable"
                  : "Failed to fetch",
            res.status,
        )
    }

    throw new ApiError("Unexpected error", 500)
}

export const apiFetchHandler = async <T>(
    url: string,
    options?: RequestInit,
    retryOptions?: RetryOptions,
): Promise<T> => {
    try {
        return await fetchWithRetry<T>(url, options, retryOptions)
    } catch (err) {
        if (err instanceof ApiError && err.status === 404 && !retryOptions?.throwOnNotFound) {
            notFound()
        }
        throw err
    }
}
