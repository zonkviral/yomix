import { notFound } from "next/navigation"

class ApiError extends Error {
    constructor(
        message: string,
        public status: number,
    ) {
        super(message)
        this.name = "ApiError"
    }
}

export const apiFetchHandler = async <T>(
    url: string,
    options?: RequestInit,
): Promise<T> => {
    try {
        const res = await fetch(url, options)

        if (!res.ok) {
            switch (res.status) {
                case 404:
                    notFound()
                case 429:
                    throw new ApiError("Rate limited", 429)
                case 503:
                    throw new ApiError("Service unavailable", 503)
                default:
                    throw new ApiError("Failed to fetch", res.status)
            }
        }

        return res.json()
    } catch (err) {
        if (err instanceof ApiError) throw err

        if (err instanceof TypeError) {
            throw new ApiError("Network error", 503)
        }

        if (err instanceof SyntaxError) {
            throw new ApiError("Invalid response from server", 502)
        }

        throw new ApiError("Unexpected error", 500)
    }
}
