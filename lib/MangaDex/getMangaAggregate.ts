import { BASE_URL } from "./constants"

import { apiFetchHandler } from "@/utils/apiFetchHandler"

interface AggregateVolume {
    volume: string
    count: number
    chapters: Record<string, { chapter: string; id: string; count: number }>
}

export interface AggregateResponse {
    result: string
    volumes: Record<string, AggregateVolume>
}

export const getMangaAggregate = (id: string) =>
    apiFetchHandler<AggregateResponse>(`${BASE_URL}/manga/${id}/aggregate`)

export const getLastChapterNumber = (aggregate: AggregateResponse): number => {
    let max = 0
    for (const volume of Object.values(aggregate.volumes ?? {})) {
        for (const key of Object.keys(volume.chapters ?? {})) {
            const n = parseFloat(key)
            if (Number.isFinite(n) && n > max) max = n
        }
    }
    return max
}
