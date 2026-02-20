import { Manga, MangaCoverArt, MangaRelationship } from "./types"

export const getCoverUrl = (manga: Manga, size?: 256 | 512) => {
    if (!manga) return null
    const cover = manga.relationships.find(
        (rel: MangaRelationship) => rel.type === "cover_art",
    ) as MangaCoverArt

    if (!cover?.attributes?.fileName) return null

    const fileName = cover.attributes.fileName
    if (!size) {
        return `https://uploads.mangadex.org/covers/${manga.id}/${fileName}`
    }
    return `https://uploads.mangadex.org/covers/${manga.id}/${fileName}.${size}.jpg`
}
