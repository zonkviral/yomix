import { getMangaChapter } from "@/lib/MangaDex/getMangaChapter"
import { getMangaChaptersList } from "@/lib/MangaDex/getMangaChaptersList"
import { getMangaById } from "@/lib/MangaDex/getMangaById"

import { MangaReader } from "@/features/reader/components/MangaReader"

import { getTitle } from "@/utils/getTitle"

const ChapterPage = async ({
    params,
    searchParams,
}: {
    params: Promise<{ mangaId: string; chapterId: string }>
    searchParams: Promise<{ page?: string }>
}) => {
    const { mangaId, chapterId } = await params
    const { page } = await searchParams

    const initialPage = page ? parseInt(page) - 1 : 0

    const [manga, chapterList] = await Promise.all([
        getMangaById(mangaId),
        getMangaChaptersList(mangaId),
    ])

    const mangaChapter = await getMangaChapter(
        chapterId !== "1" ? chapterId : chapterList[0].id,
    )
    const mangaTitle =
        getTitle(
            manga.attributes.title,
            manga.attributes.altTitles,
            "ru",
        )?.[0] ??
        getTitle(
            manga.attributes.title,
            manga.attributes.altTitles,
            "en",
        )?.[0] ??
        Object.values(manga.attributes.title)[0]

    const initialPages = mangaChapter.chapter.data.map(
        (file: string) =>
            `/api/mangadex-image?url=${encodeURIComponent(
                `${mangaChapter.baseUrl}/data/${mangaChapter.chapter.hash}/${file}`,
            )}`,
    )

    const initialPagesThumbs = mangaChapter.chapter.dataSaver.map(
        (file: string) =>
            `/api/mangadex-image?url=${encodeURIComponent(
                `${mangaChapter.baseUrl}/data-saver/${mangaChapter.chapter.hash}/${file}`,
            )}`,
    )

    return (
        <MangaReader
            mangaTitle={mangaTitle}
            mangaId={mangaId}
            initialChapterId={chapterId !== "1" ? chapterId : chapterList[0].id}
            initialPage={initialPage}
            initialPages={initialPages}
            initialPagesThumbs={initialPagesThumbs}
            chapterList={chapterList}
        />
    )
}

export default ChapterPage
