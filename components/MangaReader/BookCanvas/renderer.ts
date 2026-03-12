import { PageFlip } from "page-flip"

type PageFlipRender = {
    getContext: () => CanvasRenderingContext2D
    drawFrame: () => void
    clear: () => void
    __patched?: boolean
    __resizeObserver?: ResizeObserver | null
    __fullscreenHandler?: () => void
}
const getRender = (book: PageFlip): PageFlipRender => {
    return (book as unknown as { getRender: () => PageFlipRender }).getRender()
}

export const setupRenderer = (book: PageFlip): void => {
    try {
        const render = getRender(book)
        const ctx = render.getContext()
        const canvas = ctx.canvas

        const resize = () => {
            const dpr = window.devicePixelRatio || 1
            const cssWidth = canvas.clientWidth
            const cssHeight = canvas.clientHeight
            if (cssWidth <= 0 || cssHeight <= 0) return
            canvas.width = Math.round(cssWidth * dpr)
            canvas.height = Math.round(cssHeight * dpr)
            canvas.style.width = cssWidth + "px"
            canvas.style.height = cssHeight + "px"
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
            render.drawFrame()
        }

        if (!render.__patched) {
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
            render.__patched = true
        }

        resize()

        if (!render.__resizeObserver) {
            const observer = new ResizeObserver(resize)
            observer.observe(canvas)
            render.__resizeObserver = observer
        }
    } catch {
        console.warn("setupRenderer failed")
    }
}

export const teardownRenderer = (book: PageFlip): void => {
    try {
        const render = getRender(book)
        render.__resizeObserver?.disconnect()
        render.__resizeObserver = null
    } catch (err) {
        console.error(err)
    }
}
