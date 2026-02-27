import { MangaReader } from "@/components/MangaReader/MangaReader"
import { getMangaChapter } from "@/lib/MangaDex/getMangaChapter"
import { getMangaChaptersList } from "@/lib/MangaDex/getMangaChaptersList"

const ChapterPage = async ({
    params,
}: {
    params: Promise<{ mangaId: string; chapterId: string }>
}) => {
    const { mangaId } = await params
    const mangaChapterList = await getMangaChaptersList(mangaId)
    const chapter = await getMangaChapter(mangaChapterList.id)
    const pages = chapter.chapter.data.map(
        (file: string) =>
            `${chapter.baseUrl}/data/${chapter.chapter.hash}/${file}`,
    )
    return (
        <MangaReader pages={pages} />

        // <List
        //     className=""
        //     list={chapter.chapter.data}
        //     renderItem={(data) => (
        //         <Chapter
        //             chapter={data}
        //             hash={chapter.chapter.hash}
        //             baseUrl={chapter.baseUrl}
        //         />
        //     )}
        // />
    )
}

export default ChapterPage
