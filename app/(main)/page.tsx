import { unstable_cache } from "next/cache"
import { SWRConfig } from "swr"

import { PopularList } from "@/components/PopularList/PopularList"
import { getMangaListAction } from "@/actions/getMangaList.action"
import { NewestList } from "@/components/Newest/Newest"

const getCachedMangaList = unstable_cache(
    (page: number) => getMangaListAction(page),
    ["manga-list"],
    { revalidate: 60 * 10 },
)

const HomePage = async () => {
    const initialData = await getCachedMangaList(0)

    return (
        <SWRConfig
            value={{
                fallback: {
                    "manga-list-0": initialData,
                },
            }}
        >
            <PopularList />
            <NewestList />
        </SWRConfig>
    )
}

export default HomePage
