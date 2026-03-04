/**
 * Loads an image with crossOrigin=anonymous.
 * Required for canvas.toDataURL() on cross-origin images (MangaDex CDN).
 * Returns null on failure — caller decides fallback.
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
 * Splits a wide HTMLImageElement into left/right dataURLs.
 */
export function splitImg(img: HTMLImageElement): [string, string] {
    const halfW = Math.floor(img.naturalWidth / 2)
    const h = img.naturalHeight

    const left = document.createElement("canvas")
    left.width = halfW
    left.height = h
    left.getContext("2d")!.drawImage(img, 0, 0, halfW, h, 0, 0, halfW, h)

    const right = document.createElement("canvas")
    right.width = halfW
    right.height = h
    right.getContext("2d")!.drawImage(img, halfW, 0, halfW, h, 0, 0, halfW, h)

    return [left.toDataURL(), right.toDataURL()]
}

/**
 * Rotates a wide HTMLImageElement 90deg CW into a dataURL.
 * Used for mobile wide pages — single slot, user rotates phone.
 */
export function rotateImg(img: HTMLImageElement): string {
    const canvas = document.createElement("canvas")
    canvas.width = img.naturalHeight
    canvas.height = img.naturalWidth
    const ctx = canvas.getContext("2d")!
    ctx.translate(canvas.width / 2, canvas.height / 2)
    ctx.rotate(Math.PI / 2)
    ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2)
    return canvas.toDataURL()
}
