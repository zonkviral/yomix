import { PageFlip, SizeType, WidgetEvent } from "page-flip"
import {
    preloadImage,
    loadCrossOrigin,
    revokeBlobUrls,
} from "./imageTransforms"
import { setupRenderer } from "./renderer"
import {
    PageInfo,
    BookStructure,
    buildStructure,
    isWide,
} from "./buildStructure"

const CONTAINER_TIMEOUT_MS = 5000

export type BookCache = {
    urls: string[]
    pageToSlot: number[]
    slotToPage: number[]
}

export interface InitConfig {
    container: HTMLDivElement
    pages: string[]
    currentIndex: number
    onFlipRef: React.RefObject<(pageIndex: number) => void>
    flipBookRef: React.RefObject<PageFlip | null>
    cacheRef: React.RefObject<BookCache | null>
    signal: AbortSignal
    onLoaded: (structure: BookStructure) => void
    onError: (msg: string) => void
}

export const initBook = async (config: InitConfig): Promise<void> => {
    const {
        container,
        pages,
        currentIndex,
        onFlipRef,
        flipBookRef,
        cacheRef,
        signal,
        onLoaded,
        onError,
    } = config

    flipBookRef.current?.destroy()
    flipBookRef.current = null

    const isMounted = () => !signal.aborted
    const isMobile = window.matchMedia("(max-width: 767px)").matches
    const blobUrls: string[] = []

    await new Promise<void>((resolve, reject) => {
        if (container.clientWidth > 0) {
            resolve()
            return
        }

        let settled = false
        const settle = (fn: () => void) => {
            if (!settled) {
                settled = true
                fn()
            }
        }

        const observer = new ResizeObserver(() => {
            if (container.clientWidth > 0) {
                observer.disconnect()
                settle(resolve)
            }
        })
        observer.observe(container)
        signal.addEventListener(
            "abort",
            () => {
                observer.disconnect()
                settle(reject)
            },
            { once: true },
        )
        setTimeout(() => {
            observer.disconnect()
            settle(resolve)
        }, CONTAINER_TIMEOUT_MS)
    }).catch(() => null)

    if (!isMounted()) return

    const preloaded = await Promise.all(pages.map((url) => preloadImage(url)))
    if (!isMounted()) return

    const pageInfos: PageInfo[] = await Promise.all(
        preloaded.map(async (img, i): Promise<PageInfo> => {
            if (!img) {
                return { img: new Image(), isWide: false, url: pages[i] }
            }
            if (!isWide(img)) {
                return { img, isWide: false, url: pages[i] }
            }
            const corsImg = await loadCrossOrigin(pages[i])
            if (!isMounted()) return { img, isWide: false, url: pages[i] }
            return { img: corsImg ?? img, isWide: true, url: pages[i] }
        }),
    )
    if (!isMounted()) return

    let structure: BookStructure
    try {
        structure = await buildStructure(pageInfos, isMobile, blobUrls)
    } catch (err) {
        console.error("buildStructure failed", err)
        onError("Failed to process pages")
        revokeBlobUrls(blobUrls)
        return
    }

    if (!isMounted()) {
        revokeBlobUrls(blobUrls)
        return
    }

    // build slotToPage reverse map — slot index → real page index
    // wide pages on desktop occupy 2 slots (left+right), both map to same page
    const slotToPage: number[] = new Array(structure.urls.length).fill(-1)
    for (let pageIdx = 0; pageIdx < structure.pageToSlot.length; pageIdx++) {
        const slot = structure.pageToSlot[pageIdx]
        slotToPage[slot] = pageIdx
        // wide page occupies slot+1 too — point it to same page
        if (
            pageInfos[pageIdx].isWide &&
            !isMobile &&
            slot + 1 < slotToPage.length
        ) {
            slotToPage[slot + 1] = pageIdx
        }
    }
    // fill any remaining -1 gaps (blank padding slots) with nearest previous page
    for (let s = 1; s < slotToPage.length; s++) {
        if (slotToPage[s] === -1) slotToPage[s] = slotToPage[s - 1]
    }

    cacheRef.current = {
        urls: [...structure.urls],
        pageToSlot: [...structure.pageToSlot],
        slotToPage,
    }

    const startSlot = structure.pageToSlot[currentIndex] ?? 0

    const book = new PageFlip(container, {
        width: 400,
        height: 566,
        minWidth: 300,
        maxWidth: 2000,
        minHeight: 400,
        maxHeight: 2800,
        size: "stretch" as SizeType,
        drawShadow: true,
        flippingTime: 250,
        usePortrait: true,
        startPage: startSlot,
        showCover: false,
    })

    flipBookRef.current = book

    signal.addEventListener(
        "abort",
        () => {
            revokeBlobUrls(blobUrls)
            book.destroy()
            flipBookRef.current = null
        },
        { once: true },
    )

    book.on("init", () => {
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                if (flipBookRef.current) setupRenderer(flipBookRef.current)
            })
        })
        if (!isMounted()) return
        onLoaded(structure)
    })

    book.on("flip", (e: WidgetEvent) => {
        const slotIndex = e?.data as number
        const pageIndex = cacheRef.current?.slotToPage[slotIndex] ?? slotIndex
        onFlipRef.current(pageIndex)
    })

    if (!isMounted()) return
    book.loadFromImages([...structure.urls])
}
