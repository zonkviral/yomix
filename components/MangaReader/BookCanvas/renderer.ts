/* eslint-disable @typescript-eslint/no-explicit-any */
import { PageFlip } from "page-flip"

export function setupRenderer(book: PageFlip): void {
    try {
        const render = (book as any).getRender()
        const ctx = render.getContext()
        const canvas = ctx.canvas
        const dpr = window.devicePixelRatio || 1
        const cssWidth = canvas.clientWidth
        const cssHeight = canvas.clientHeight

        if (cssWidth > 0 && cssHeight > 0) {
            canvas.width = Math.round(cssWidth * dpr)
            canvas.height = Math.round(cssHeight * dpr)
            canvas.style.width = cssWidth + "px"
            canvas.style.height = cssHeight + "px"
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
        }

        const originalDrawFrame = render.drawFrame.bind(render)
        render.drawFrame = function () {
            ctx.imageSmoothingEnabled = true
            ctx.imageSmoothingQuality = "high"
            originalDrawFrame()
        }

        render.clear = function () {
            ctx.fillStyle = "#0d0f1400"
            ctx.fillRect(0, 0, canvas.width, canvas.height)
        }

        render.drawFrame()
    } catch {
        console.warn("setupRenderer failed")
    }
}
