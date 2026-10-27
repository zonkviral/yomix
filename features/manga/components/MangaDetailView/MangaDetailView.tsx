"use client"

import { statusTranslationMap } from "@/lib/MangaDex/mappings/statusTranslationMap"
import { MangaInfo, Manga, Bookmark } from "@/lib/supabase/type"

import { TabNav } from "../TabNav/TabNav"
import { MangaHeader } from "../MangaHeader/MangaHeader"
import { MangaOverview } from "../MangaOverview/MangaOverview"
import { TabChapters } from "../TabChapters/TabChapters"

import { AvailableSource, NormalizedChapter } from "@/lib/chapters/types"
import { useEffect } from "react"
import { useBookmarksStore } from "@/features/bookmarks/store/bookmarks.store"

interface MangaDetailViewProps {
    id: string
    title: string
    coverUrl: string | null
    rating?: number
    description: string
    manga: Manga
    info: MangaInfo
    isBookmarked?: boolean
    activeBookmark?: Bookmark | null
    activeTab?: string
    activeSource: string
    altTitle: string
    chapterSourceList: NormalizedChapter[]
    availableSources: AvailableSource[]
}

export const MangaDetailView = ({
    id,
    title,
    altTitle,
    coverUrl,
    rating,
    description,
    manga,
    info,
    activeBookmark,
    activeTab,
    activeSource,
    chapterSourceList,
    availableSources,
}: MangaDetailViewProps) => {
    useEffect(() => {
        useBookmarksStore.setState({ activeBookmark: activeBookmark })
    }, [activeBookmark])

    const tableData = [
        { label: "Автор:", value: info.author },
        { label: "Художник:", value: info.artist },
        {
            label: "Статус:",
            value: statusTranslationMap[info.status] || info.status,
        },
        { label: "Год:", value: info.year },
    ]

    return (
        <div className="px-0 py-2 md:px-4 md:py-5 xl:px-20">
            <MangaHeader
                coverUrl={coverUrl || ""}
                id={id}
                title={title}
                altTitle={altTitle}
                rating={rating}
                info={info}
                manga={manga}
            />
            <div className="mt-10">
                <TabNav active={activeTab} />
                {(activeTab === "overview" || !activeTab) && (
                    <MangaOverview description={description} tableData={tableData} />
                )}
                {activeTab === "chapters" && (
                    <TabChapters
                        mangaId={id}
                        availableSources={availableSources}
                        chapters={chapterSourceList}
                        activeSource={activeSource}
                    />
                )}
            </div>
        </div>
    )
}
