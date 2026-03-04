import { splitWideImageToBlobUrls, rotateUrlToBlobUrl } from "./imageTransforms"

export type PageStructure = {
    slots: number[]
    isWide: boolean
}

export type IndexMap = PageStructure[]

export interface EngineConfig {
    pages: string[]
    initialUrls: string[]
    indexMap: IndexMap
    isMobile: boolean
    /**
     * Called once after a full upgrade batch completes.
     * Receives the full current URL array.
     * Implementor calls book.updateFromImages([...urls]).
     */
    redraw: (urls: readonly string[]) => void
}

/**
 * UpgradeEngine — async hi-res upgrade pipeline.
 *
 * Confirmed from debugging:
 *   - page.load(blobUrl) silently ignored by page-flip
 *   - updateFromImages([...urls]) is the only working update path
 *   - Portrait: plain URL, page-flip fetches itself via updateFromImages
 *   - Wide desktop: OffscreenCanvas split to blob
 *   - Wide mobile: OffscreenCanvas rotate to blob
 *   - ONE updateFromImages per batch via rAF — no epilepsy
 *   - flipEnd event used — no animation conflicts
 */
export class UpgradeEngine {
    private readonly pages: string[]
    private readonly indexMap: IndexMap
    private readonly isMobile: boolean
    private readonly redraw: (urls: readonly string[]) => void

    private fullUrls: string[]
    private blobUrls: string[]

    private upgradedUpTo = -1
    private running = false
    private pending: { from: number; to: number } | null = null
    private destroyed = false
    private rafId: number | null = null

    constructor(config: EngineConfig) {
        this.pages = config.pages
        this.indexMap = config.indexMap
        this.isMobile = config.isMobile
        this.redraw = config.redraw
        this.fullUrls = [...config.initialUrls]
        this.blobUrls = new Array(config.initialUrls.length).fill("")
    }

    upgradeRange(from: number, to: number): void {
        if (this.destroyed) return
        from = Math.max(from, this.upgradedUpTo + 1)
        to = Math.min(to, this.pages.length - 1)
        if (from > to) return
        if (this.running) {
            this.pending = { from, to }
            return
        }
        this.running = true
        this.runUpgrade(from, to)
    }

    upgradeAround(index: number, prefetchAhead: number): void {
        this.upgradeRange(this.upgradedUpTo + 1, index + prefetchAhead)
    }

    getFullUrls(): readonly string[] {
        return this.fullUrls
    }

    // Idempotent — safe for React strict mode double-invoke
    destroy(): void {
        if (this.destroyed) return
        this.destroyed = true
        this.pending = null
        if (this.rafId !== null) {
            cancelAnimationFrame(this.rafId)
            this.rafId = null
        }
        this.cleanupBlobs()
    }

    private async runUpgrade(from: number, to: number): Promise<void> {
        for (let i = from; i <= to; i++) {
            if (this.destroyed) break
            const page = this.indexMap[i]
            if (!page) continue
            const { slots, isWide } = page
            try {
                if (slots.length === 2) {
                    await this.upgradeWideDesktop(i, slots)
                } else if (isWide && this.isMobile) {
                    await this.upgradeMobileWide(i, slots[0])
                } else {
                    // Portrait — just swap URL string
                    // page-flip fetches it itself via updateFromImages
                    this.fullUrls[slots[0]] = this.pages[i]
                }
            } catch {
                console.warn(`Upgrade failed for page ${i}`)
            } finally {
                // Always advance — failed pages stay as thumb
                this.upgradedUpTo = i
            }
        }

        // ONE redraw after entire batch via rAF — zero epilepsy
        if (!this.destroyed) {
            this.rafId = requestAnimationFrame(() => {
                this.rafId = null
                if (!this.destroyed) this.redraw(this.fullUrls)
            })
        }

        this.running = false

        if (!this.destroyed && this.pending) {
            const { from: pFrom, to: pTo } = this.pending
            this.pending = null
            this.upgradeRange(pFrom, pTo)
        }
    }

    private async upgradeWideDesktop(
        index: number,
        slots: number[],
    ): Promise<void> {
        const [leftBlob, rightBlob] = await splitWideImageToBlobUrls(
            this.pages[index],
        )
        if (this.destroyed) {
            URL.revokeObjectURL(leftBlob)
            URL.revokeObjectURL(rightBlob)
            return
        }
        this.replaceSlotBlob(slots[0], leftBlob)
        this.replaceSlotBlob(slots[1], rightBlob)
    }

    private async upgradeMobileWide(
        index: number,
        slot: number,
    ): Promise<void> {
        const blobUrl = await rotateUrlToBlobUrl(this.pages[index])
        if (this.destroyed) {
            URL.revokeObjectURL(blobUrl)
            return
        }
        this.replaceSlotBlob(slot, blobUrl)
    }

    private replaceSlotBlob(slot: number, newBlob: string): void {
        const existing = this.blobUrls[slot]
        if (existing) URL.revokeObjectURL(existing)
        this.fullUrls[slot] = newBlob
        this.blobUrls[slot] = newBlob
    }

    private cleanupBlobs(): void {
        for (const url of this.blobUrls) {
            if (url) URL.revokeObjectURL(url)
        }
    }
}
