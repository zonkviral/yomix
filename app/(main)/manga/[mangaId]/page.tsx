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
    const {
        data: { user },
    } = await supabase.auth.getUser()
    let isBookmarked = false
    if (user) {
        const { data } = await supabase
            .from("manga_sources")
            .select("manga_id, manga(bookmarks(id))")
            .eq("source", "mangadex")
            .eq("external_id", mangaId)
            .eq("manga.bookmarks.user_id", user.id)
            .single()
        isBookmarked = !!data?.manga?.[0]?.bookmarks?.[0]
    }
    const manga = await getMangaById(mangaId)
    const coverUrl = getCoverUrl(manga)
    const title = getTitle(
        manga.attributes.title,
        manga.attributes.altTitles,
        "ru",
    )
    const titleEn = getTitle(
        manga.attributes.title,
        manga.attributes.altTitles,
        "en",
    )
    const mangaTitle = await searchMangaByName(titleEn?.[0] ?? "")
    const mangaRu = mangaTitle && (await getMangaByName(mangaTitle[0].dir))
    const statistic = await getMangaStatistics(mangaId)
    const description = htmlTagsRemover(
        manga.attributes.description["ru"] ??
            (mangaRu && mangaRu.description) ??
            manga.attributes.description["en"],
    )
    const chapterList = await getMangaChaptersList(mangaId)

    const fullTitle =
        title?.[0] ??
        mangaRu?.rus_name ??
        titleEn?.[0] ??
        "Неизвестное название"

    return (
        <MangaOverview
            id={mangaId}
            title={fullTitle}
            isBookmarked={isBookmarked}
            coverUrl={coverUrl}
            rating={statistic.rating.average}
            description={description}
            manga={{
                externalId: mangaId,
                source: manga.source,
                author: getAuthor(manga),
                title: fullTitle,
                coverUrl: getCoverUrl(manga, 256) ?? "",
                totalChapters: chapterList.length,
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
