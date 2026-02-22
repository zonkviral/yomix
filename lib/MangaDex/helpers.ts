import { Manga, MangaAuthorRelationship } from "./types"
export const getAuthor = (manga: Manga) => {
    const rel = manga.relationships.find((r) => r.type === "author") as
        | MangaAuthorRelationship
        | undefined
    return rel?.attributes?.name ?? "Unknown"
}

export const getArtist = (manga: Manga) => {
    const rel = manga.relationships.find((r) => r.type === "artist") as
        | MangaAuthorRelationship
        | undefined
    return rel?.attributes?.name ?? "Unknown"
}

export const getTags = (manga: Manga) =>
    manga.attributes.tags.map((tag) => tag.attributes.name.en)
