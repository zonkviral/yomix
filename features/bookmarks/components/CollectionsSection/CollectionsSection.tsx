import { List } from "@/components/List/List"
import { Collection } from "@/lib/supabase/type"

import Link from "next/link"

interface CollectionsSectionProps {
    collections: Collection[]
}

export const CollectionsSection = ({
    collections,
}: CollectionsSectionProps) => (
    <section className="my-6 bg-neutral-900 p-4 shadow-md">
        <Link href="/collections/all" className="w-fit">
            <h2 className="text-xl font-bold">Твои коллекции</h2>
        </Link>
        <List
            className="mt-4 flex flex-col gap-2"
            items={collections}
            renderItem={(collection) => (
                <Link
                    href={`/collections/${collection.id}`}
                    className="flex items-center gap-4 rounded p-1 hover:bg-neutral-800"
                >
                    {/* <span className="text-lg">{collection.iconValue}</span> */}
                    <h3 className="text-lg font-semibold">{collection.name}</h3>
                </Link>
            )}
        />
    </section>
)
