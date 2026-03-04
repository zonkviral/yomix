import { rotateImg, splitImg } from "./imageTransforms"

const BLANK =
    "data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs="

export const MAX_WIDE_RESERVED = 6

export type PageInfo = {
    img: HTMLImageElement
    isWide: boolean
    url: string
}

/**
 * Builds displayUrls from collected pageInfos up to lastIndex.
 * Called incrementally as pages load — fires updateFromImages early
 * so wide pages are fixed as soon as discovered, not after all pages load.
 */
export function buildDisplayUrls(
    pageInfos: (PageInfo | null)[],
    totalPages: number,
    finalSlots: number,
    isMobile: boolean,
    lastIndex: number,
): string[] {
    const displayUrls: string[] = Array(finalSlots).fill(BLANK)
    let slot = 0
    let reservedUsed = 0

    for (let i = 0; i <= lastIndex && i < totalPages; i++) {
        const info = pageInfos[i]

        if (!info || !info.isWide) {
            displayUrls[slot] = info ? info.url : BLANK
            slot++
            continue
        }

        if (isMobile) {
            displayUrls[slot] = rotateImg(info.img)
            slot++
            continue
        }

        // Desktop wide — must start on even slot boundary
        if (slot % 2 !== 0) {
            displayUrls[slot] = BLANK
            slot++
        }

        if (reservedUsed < MAX_WIDE_RESERVED) {
            const [leftUrl, rightUrl] = splitImg(info.img)
            displayUrls[slot] = leftUrl
            displayUrls[slot + 1] = rightUrl
            slot += 2
            reservedUsed++
        } else {
            // No reservations left — portrait fallback
            displayUrls[slot] = info.url
            slot++
        }
    }

    // Fill remaining unprocessed pages with original URLs
    // so page-flip keeps showing them while they load
    for (let i = lastIndex + 1; i < totalPages; i++) {
        if (slot < finalSlots) {
            displayUrls[slot] = pageInfos[i]?.url ?? BLANK
            slot++
        }
    }

    return displayUrls
}

/**
 * Removes trailing blank slots, keeps even count.
 * Called only on final updateFromImages.
 * page-flip accepts shorter array than initialized with — hides excess pages.
 */
export function trimBlanks(urls: string[]): string[] {
    let last = urls.length - 1
    while (last > 0 && urls[last] === BLANK) last--
    const end = last % 2 === 0 ? last + 2 : last + 1
    return urls.slice(0, end)
}

export { BLANK }
