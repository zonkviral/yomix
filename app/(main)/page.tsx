import { getMangaListAction } from "@/actions/getMangaList.action"

import { PopularList } from "./_components/PopularList/PopularList"
import { NewestList } from "./_components/Newest/Newest"

import { SWRConfig } from "swr"

const HomePage = async () => {
    const initialData = await getMangaListAction(0)

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
