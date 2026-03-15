import { splitImg, rotateImg } from "./imageTransforms"

export const BLANK =
    "data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs="

const WIDE_RATIO = 1.2

export const isWide = (img: HTMLImageElement): boolean => {
    return img.naturalWidth / img.naturalHeight > WIDE_RATIO
}

export type PageInfo = {
    img: HTMLImageElement
    isWide: boolean
    url: string
}

export type BookStructure = {
    urls: string[]
    pageToSlot: number[]
    totalSlots: number
}

export const buildStructure = async (
    pageInfos: PageInfo[],
    isMobile: boolean,
    blobUrls: string[],
): Promise<BookStructure> => {
    const pageToSlot: number[] = new Array(pageInfos.length).fill(0)
    const slotUrls: string[] = []

    for (let i = 0; i < pageInfos.length; i++) {
        const info = pageInfos[i]

        if (!info.isWide) {
            pageToSlot[i] = slotUrls.length
            slotUrls.push(info.url)
            continue
        }

        if (isMobile) {
            // rotate — 1 slot
            pageToSlot[i] = slotUrls.length
            const rotated = await rotateImg(info.img, blobUrls)
            slotUrls.push(rotated)
            continue
        }

        // desktop wide — must land on even slot (left page of spread)
        if (slotUrls.length % 2 !== 0) {
            slotUrls.push(BLANK)
        }
        pageToSlot[i] = slotUrls.length
        const [leftUrl, rightUrl] = await splitImg(info.img, blobUrls)
        slotUrls.push(leftUrl, rightUrl)
    }

    // page-flip needs even total count
    if (slotUrls.length % 2 !== 0) {
        slotUrls.push(BLANK)
    }

    return {
        urls: slotUrls,
        pageToSlot,
        totalSlots: slotUrls.length,
    }
}
