/* eslint-disable @typescript-eslint/no-explicit-any */
export const getCoverUrl = (manga: any, size?: 256 | 512) => {
    const cover = manga.relationships.find(
        (rel: any) => rel.type === "cover_art",
    )

    if (!cover) return null

    const fileName = cover.attributes.fileName
    if (!size) {
        return `https://uploads.mangadex.org/covers/${manga.id}/${fileName}`
    }
    return `https://uploads.mangadex.org/covers/${manga.id}/${fileName}.${size}.jpg`
}
