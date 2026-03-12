/**
 * Loads an image with crossOrigin=anonymous.
 * Required for canvas access when images come from a CDN.
 */
export function loadCrossOrigin(url: string): Promise<HTMLImageElement | null> {
    return new Promise((resolve) => {
        const img = new Image()
        img.crossOrigin = "anonymous"
        img.onload = () => resolve(img)
        img.onerror = () => {
            console.warn(`crossOrigin load failed: ${url.slice(0, 60)}`)
            resolve(null)
        }
        img.src = url
    })
}

/**
 * Preloads an image just to get naturalWidth/naturalHeight.
 * No crossOrigin — faster, no CORS preflight.
 */
export function preloadImage(url: string): Promise<HTMLImageElement | null> {
    return new Promise((resolve) => {
        const img = new Image()
        img.onload = () => resolve(img)
        img.onerror = () => resolve(null)
        img.src = url
    })
}

function canvasToUrl(
    canvas: HTMLCanvasElement,
    blobUrls: string[],
): Promise<string> {
    return new Promise((resolve) => {
        canvas.toBlob(
            (blob) => {
                if (!blob) {
                    resolve("")
                    return
                }
                const url = URL.createObjectURL(blob)
                blobUrls.push(url)
                resolve(url)
            },
            "image/png",
            1,
        )
    })
}

export async function splitImg(
    img: HTMLImageElement,
    blobUrls: string[],
): Promise<[string, string]> {
    const halfW = Math.floor(img.naturalWidth / 2)
    const h = img.naturalHeight

    const left = document.createElement("canvas")
    left.width = halfW
    left.height = h
    const leftCtx = left.getContext("2d")
    if (!leftCtx) throw new Error("Canvas context unavailable")
    leftCtx.drawImage(img, 0, 0, halfW, h, 0, 0, halfW, h)

    const right = document.createElement("canvas")
    right.width = halfW
    right.height = h
    const rightCtx = right.getContext("2d")
    if (!rightCtx) throw new Error("Canvas context unavailable")
    rightCtx.drawImage(img, halfW, 0, halfW, h, 0, 0, halfW, h)

    const [leftUrl, rightUrl] = await Promise.all([
        canvasToUrl(left, blobUrls),
        canvasToUrl(right, blobUrls),
    ])
    return [leftUrl, rightUrl]
}

export async function rotateImg(
    img: HTMLImageElement,
    blobUrls: string[],
): Promise<string> {
    const canvas = document.createElement("canvas")
    canvas.width = img.naturalHeight
    canvas.height = img.naturalWidth
    const ctx = canvas.getContext("2d")
    if (!ctx) throw new Error("Canvas context unavailable")
    ctx.translate(canvas.width / 2, canvas.height / 2)
    ctx.rotate(Math.PI / 2)
    ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2)
    return canvasToUrl(canvas, blobUrls)
}

export function revokeBlobUrls(blobUrls: string[]): void {
    blobUrls.forEach((url) => URL.revokeObjectURL(url))
    blobUrls.length = 0
}
