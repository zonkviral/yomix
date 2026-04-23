export const BookmarksSkeleton = ({
    sidebar = false,
    rowBookmarks = true,
    colBookmarks = true,
}: {
    sidebar?: boolean
    rowBookmarks?: boolean
    colBookmarks?: boolean
}) => (
    <div className="grid animate-pulse grid-cols-[1fr_17.5rem] gap-8 p-4">
        <div className="flex flex-col gap-5">
            {colBookmarks && (
                <>
                    <div className="h-8 w-48 rounded bg-neutral-800" />
                    <div className="h-4 w-96 rounded bg-neutral-800" />
                    <div className="flex gap-4">
                        {[...Array(3)].map((_, i) => (
                            <div
                                key={i}
                                className="h-60 w-40 rounded bg-neutral-800"
                            />
                        ))}
                    </div>
                </>
            )}
            {rowBookmarks && (
                <>
                    <div className="h-6 w-32 rounded bg-neutral-800" />
                    <div className="flex flex-col gap-3">
                        {[...Array(3)].map((_, i) => (
                            <div
                                key={i}
                                className="h-20 w-full rounded bg-neutral-800"
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
        {sidebar && (
            <div className="flex flex-col gap-4">
                <div className="h-32 rounded bg-neutral-800" />
                <div className="h-48 rounded bg-neutral-800" />
            </div>
        )}
    </div>
)
