import { Discover } from "@/components/Discover/Discover"
import { PopularList } from "@/components/PopularList/PopularList"

const HomePage = async () => {
    return (
        <>
            <PopularList />
            <Discover />
        </>
    )
}

export default HomePage
