/* eslint-disable @typescript-eslint/no-explicit-any */
import { PageFlip, SizeType } from "page-flip"
import { loadCrossOrigin } from "./imageTransforms"
import { setupRenderer } from "./renderer"
import {
    PageInfo,
    buildDisplayUrls,
    trimBlanks,
    BLANK,
    MAX_WIDE_RESERVED,
} from "./buildStructure"

const MOBILE_BREAKPOINT = 768

function detectMobile(): boolean {
    return window.innerWidth < MOBILE_BREAKPOINT
}

export interface InitConfig {
    container: HTMLDivElement
    pages: string[]
    currentIndex: number
    onFlipRef: React.RefObject<(index: number) => void>
    flipBookRef: React.RefObject<PageFlip | null>
    urlCacheRef: React.RefObject<string[] | null>
    isMounted: () => boolean
    onLoaded: () => void
    onError: (msg: string) => void
}

export async function initBook(config: InitConfig): Promise<void> {
    const {
        container,
        pages,
        currentIndex,
        onFlipRef,
        flipBookRef,
        urlCacheRef,
        isMounted,
        onLoaded,
    } = config

    flipBookRef.current?.destroy()
    flipBookRef.current = null

    const isMobile = detectMobile()
    const totalPages = pages.length
    const totalSlots = totalPages + MAX_WIDE_RESERVED
    const finalSlots = totalSlots % 2 === 0 ? totalSlots : totalSlots + 1

    const loadUrls: string[] = [
        ...pages,
        ...Array(finalSlots - totalPages).fill(BLANK),
    ]

    if (!isMounted()) return

    await new Promise<void>((resolve) => {
        if (container.clientWidth > 0) {
            resolve()
            return
        }
        const observer = new ResizeObserver(() => {
            if (container.clientWidth > 0) {
                observer.disconnect()
                resolve()
            }
        })
        observer.observe(container)
    })

    if (!isMounted()) return

    const cachedUrls = urlCacheRef.current

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
        startPage: currentIndex,
        showCover: false,
    })

    flipBookRef.current = book

    book.on("init", (e: any) => {
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                if (flipBookRef.current) setupRenderer(flipBookRef.current)
            })
        })

        if (!isMounted()) return

        const internalPages: any[] = e?.object?.pages?.pages ?? []
        if (internalPages.length === 0) return

        const pageInfos: (PageInfo | null)[] = new Array(totalPages).fill(null)
        let highestConsecutiveLoaded = -1
        let lastUpdateAt = -1

        const onPageLoaded = () => {
            if (!isMounted()) return

            // Advance highestConsecutiveLoaded as far as possible
            // Only update when we have a consecutive run from where we left off
            // — avoids updating with gaps that would corrupt slot order
            while (
                highestConsecutiveLoaded + 1 < totalPages &&
                pageInfos[highestConsecutiveLoaded + 1] !== null
            ) {
                highestConsecutiveLoaded++
            }

            // Only call updateFromImages if we have new consecutive pages
            // AND a wide page was found in the new range
            if (highestConsecutiveLoaded <= lastUpdateAt) return

            const hasWide = pageInfos
                .slice(lastUpdateAt + 1, highestConsecutiveLoaded + 1)
                .some((p) => p?.isWide)

            if (!hasWide) return

            lastUpdateAt = highestConsecutiveLoaded

            const displayUrls = buildDisplayUrls(
                pageInfos,
                totalPages,
                finalSlots,
                isMobile,
                highestConsecutiveLoaded,
            )

            const isFinal = highestConsecutiveLoaded === totalPages - 1
            const trimmed = isFinal ? trimBlanks(displayUrls) : displayUrls

            urlCacheRef.current = [...trimmed]
            book.updateFromImages([...trimmed])
            onLoaded()
        }

        const collectPage = async (pageIdx: number, img: HTMLImageElement) => {
            let canvasImg = img
            if (img.naturalWidth > img.naturalHeight) {
                // Only re-fetch if wide — portrait pages don't need canvas work
                const corsImg = await loadCrossOrigin(pages[pageIdx])
                if (corsImg) canvasImg = corsImg
            }

            pageInfos[pageIdx] = {
                img: canvasImg,
                isWide:
                    img.naturalWidth > img.naturalHeight && canvasImg !== img
                        ? true
                        : img.naturalWidth > img.naturalHeight,
                url: pages[pageIdx],
            }

            onPageLoaded()
        }

        for (let i = 0; i < totalPages; i++) {
            const pg = internalPages[i]

            // prevents silent hang where collected never reaches totalPages
            if (!pg?.image) {
                pageInfos[i] = {
                    img: new Image(),
                    isWide: false,
                    url: pages[i],
                }
                onPageLoaded()
                continue
            }

            const img: HTMLImageElement = pg.image

            if (img.naturalWidth > 0) {
                collectPage(i, img)
            } else {
                img.addEventListener("load", () => collectPage(i, img), {
                    once: true,
                })

                img.addEventListener(
                    "error",
                    () => {
                        pageInfos[i] = { img, isWide: false, url: pages[i] }
                        onPageLoaded()
                    },
                    { once: true },
                )
            }
        }
    })

    book.on("flip", (e: any) => {
        onFlipRef.current(e?.data as number)
    })

    book.loadFromImages(cachedUrls ? [...cachedUrls] : [...loadUrls])

    if (isMounted() && cachedUrls) onLoaded()
}
