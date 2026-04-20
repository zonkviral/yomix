import { PageFlip } from "page-flip"

type PageFlipRender = {
    getContext: () => CanvasRenderingContext2D
    drawFrame: () => void
    clear: () => void
    __patched?: boolean
    __resizeObserver?: ResizeObserver | null
}

const getRender = (book: PageFlip): PageFlipRender => {
    return (book as unknown as { getRender: () => PageFlipRender }).getRender()
}

export const setupRenderer = (book: PageFlip): void => {
    try {
        const render = getRender(book)
        const ctx = render.getContext()
        const canvas = ctx.canvas
        const container = canvas.parentElement

        if (!container) return

        const resize = () => {
            const dpr = window.devicePixelRatio || 1

            const rect = canvas.getBoundingClientRect()

            const width = Math.round(rect.width * dpr)
            const height = Math.round(rect.height * dpr)

            if (canvas.width === width && canvas.height === height) return

            canvas.width = width
            canvas.height = height

            canvas.style.width = rect.width + "px"
            canvas.style.height = rect.height + "px"

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
                ctx.clearRect(0, 0, canvas.width, canvas.height)
            }

            render.__patched = true
        }

        resize()

        if (!render.__resizeObserver) {
            const observer = new ResizeObserver(resize)

            observer.observe(container)

            render.__resizeObserver = observer
        }

        window.addEventListener("resize", resize)
    } catch {
        console.warn("setupRenderer failed")
    }
}
