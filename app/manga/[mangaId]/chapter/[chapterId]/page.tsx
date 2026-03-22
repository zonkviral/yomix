import { getMangaChapter } from "@/lib/MangaDex/getMangaChapter"
import { getMangaChaptersList } from "@/lib/MangaDex/getMangaChaptersList"

import { MangaReader } from "@/app/manga/[mangaId]/chapter/[chapterId]/_components/MangaReader/MangaReader"
import { getMangaById } from "@/lib/MangaDex/getMangaById"
import { getTitle } from "@/utils/getTitle"

const ChapterPage = async ({
    params,
}: {
    params: Promise<{ mangaId: string; chapterId: string }>
}) => {
    const { mangaId } = await params
    const manga = await getMangaById(mangaId)
    const chapterList = await getMangaChaptersList(mangaId)
    const firstChapter = await getMangaChapter(chapterList[0].id)
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
    const initialPages = firstChapter.chapter.data.map(
        (file: string) =>
            `/api/mangadex-image?url=${encodeURIComponent(
                `${firstChapter.baseUrl}/data/${firstChapter.chapter.hash}/${file}`,
            )}`,
    )

    const initialPagesThumbs = firstChapter.chapter.dataSaver.map(
        (file: string) =>
            `/api/mangadex-image?url=${encodeURIComponent(
                `${firstChapter.baseUrl}/data-saver/${firstChapter.chapter.hash}/${file}`,
            )}`,
    )

    return (
        <MangaReader
            mangaTitle={mangaTitle}
            mangaId={mangaId}
            initialChapterId={chapterList[0].id}
            initialPages={initialPages}
            initialPagesThumbs={initialPagesThumbs}
            chapterList={chapterList}
        />
    )
}

export default ChapterPage
