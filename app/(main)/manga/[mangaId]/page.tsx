import { MangaOverview } from "../../_components/MangaOverview/MangaOverview"

import { getCoverUrl } from "@/lib/MangaDex/getCoverUrl"
import { getMangaById } from "@/lib/MangaDex/getMangaById"
import { getMangaStatistics } from "@/lib/MangaDex/getMangaStatistics"
import { getMangaChaptersList } from "@/lib/MangaDex/getMangaChaptersList"
import { getArtist, getAuthor, getTags } from "@/lib/MangaDex/helpers"

import { searchMangaByName } from "@/lib/Remanga/searchMangaByName"
import { getMangaByName } from "@/lib/Remanga/getMangabyName"

import { createClient } from "@/lib/supabase/server"

import { getFlagUrl } from "@/utils/langToFlag"
import { getTitle } from "@/utils/getTitle"
import { htmlTagsRemover } from "@/utils/htmlTagsRemover"

export const MangaPageInfo = async ({
    params,
}: {
    params: Promise<{ mangaId: string }>
}) => {
    const { mangaId } = await params
    const supabase = await createClient()

    const manga = await getMangaById(mangaId)

    const titleEn = getTitle(
        manga.attributes.title,
        manga.attributes.altTitles,
        "en",
    )
    const titleRu = getTitle(
        manga.attributes.title,
        manga.attributes.altTitles,
        "ru",
    )

    const [
        statistic,
        chapterList,
        {
            data: { user },
        },
        mangaTitleResults,
    ] = await Promise.all([
        getMangaStatistics(mangaId),
        getMangaChaptersList(mangaId),
        supabase.auth.getUser(),
        searchMangaByName(titleEn?.[0] ?? ""),
    ])

    const [mangaRu] = await Promise.all([
        mangaTitleResults?.[0]
            ? getMangaByName(mangaTitleResults[0].dir)
            : Promise.resolve(null),

        user
            ? supabase
                  .from("bookmarks")
                  .select("id")
                  .eq("user_id", user.id)
                  .match({ "manga.manga_sources.external_id": mangaId })
                  .single()
            : Promise.resolve(false),
    ])

    const coverUrl = getCoverUrl(manga)
    const description = htmlTagsRemover(
        manga.attributes.description["ru"] ??
            (mangaRu && mangaRu.description) ??
            manga.attributes.description["en"],
    )
    const fullTitle =
        titleRu?.[0] ??
        mangaRu?.rus_name ??
        titleEn?.[0] ??
        "Неизвестное название"

    return (
        <MangaOverview
            id={mangaId}
            title={fullTitle}
            coverUrl={coverUrl}
            rating={statistic.rating.average}
            description={description}
            manga={{
                id: mangaId,
                manga_sources: [
                    {
                        id: "",
                        source: manga.source,
                        external_id: mangaId,
                        manga_id: mangaId,
                    },
                ],
                author: getAuthor(manga),
                title: fullTitle,
                cover_url: getCoverUrl(manga, 256) ?? "",
                total_chapters: parseFloat(
                    chapterList[chapterList.length - 1]?.attributes.chapter ||
                        "0",
                ),
                reading_progress: [],
            }}
            info={{
                author: getAuthor(manga),
                artist: getArtist(manga),
                status: manga.attributes.status,
                year: manga.attributes.year,
                tags: getTags(manga),
                languages: manga.attributes.availableTranslatedLanguages.map(
                    (lang) => getFlagUrl(lang),
                ),
            }}
        />
    )
}

export default MangaPageInfo
