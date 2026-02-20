import { Discover } from "@/components/Discover/Discover"
import { PopularList } from "@/components/PopularList/PopularList"

const HomePage = async () => {
    return (
        <>
            <section className="overflow-hidden">
                <h2 className="mb-3 text-4xl font-bold">Popular Now</h2>
                <PopularList />
            </section>
            <Discover />
        </>
    )
}

export default HomePage
