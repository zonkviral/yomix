import useSWR from "swr"
import { getMangaListAction } from "@/actions/getMangaList.action"

const LIMIT = 10

export const useMangaList = (page: number) => {
    const { data, isLoading, error } = useSWR(
        `manga-list-${page}`,
        () => getMangaListAction(page),
        { keepPreviousData: true },
    )

    return {
        items: data?.items ?? [],
        totalPages: Math.ceil((data?.total ?? 0) / LIMIT),
        isLoading,
        error,
    }
}
