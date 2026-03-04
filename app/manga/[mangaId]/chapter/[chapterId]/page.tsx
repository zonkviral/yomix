import { getMangaChapter } from "@/lib/MangaDex/getMangaChapter"
import { getMangaChaptersList } from "@/lib/MangaDex/getMangaChaptersList"

import { MangaReader } from "@/components/MangaReader/MangaReader"

const ChapterPage = async ({
    params,
}: {
    params: Promise<{ mangaId: string; chapterId: string }>
}) => {
    const { mangaId } = await params
    const mangaChapterList = await getMangaChaptersList(mangaId)
    const chapter = await getMangaChapter(mangaChapterList.id)
    const pagesThumbs = chapter.chapter.dataSaver.map(
        (file: string) =>
            `/api/mangadex-image?url=${encodeURIComponent(
                `${chapter.baseUrl}/data-saver/${chapter.chapter.hash}/${file}`,
            )}`,
    )
    const pages = chapter.chapter.data.map(
        (file: string) =>
            `/api/mangadex-image?url=${encodeURIComponent(
                `${chapter.baseUrl}/data/${chapter.chapter.hash}/${file}`,
            )}`,
    )
    return <MangaReader pages={pages} pagesThumbs={pagesThumbs} />
}

export default ChapterPage
