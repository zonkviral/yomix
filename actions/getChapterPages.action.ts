"use server"

import { getMangaChapter } from "@/lib/MangaDex/getMangaChapter"

export const getChapterPages = async (chapterId: string) => {
    const chapter = await getMangaChapter(chapterId)

    const pages = chapter.chapter.data.map(
        (file: string) =>
            `/api/mangadex-image?url=${encodeURIComponent(
                `${chapter.baseUrl}/data/${chapter.chapter.hash}/${file}`,
            )}`,
    )

    const pagesThumbs = chapter.chapter.dataSaver.map(
        (file: string) =>
            `/api/mangadex-image?url=${encodeURIComponent(
                `${chapter.baseUrl}/data-saver/${chapter.chapter.hash}/${file}`,
            )}`,
    )

    return { pages, pagesThumbs }
}
