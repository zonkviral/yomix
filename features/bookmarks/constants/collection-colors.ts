export const COLLECTION_COLORS = [
    { id: "rose", value: "text-rose-400", preview: "#fb7185" },
    { id: "orange", value: "text-orange-400", preview: "#fb923c" },
    { id: "amber", value: "text-amber-400", preview: "#fbbf24" },
    { id: "emerald", value: "text-emerald-400", preview: "#34d399" },
    { id: "sky", value: "text-sky-400", preview: "#38bdf8" },
    { id: "blue", value: "text-blue-500", preview: "#3b82f6" },
    { id: "violet", value: "text-violet-400", preview: "#a78bfa" },
    { id: "pink", value: "text-pink-400", preview: "#f472b6" },
    { id: "red", value: "text-red-400", preview: "#f87171" },
    { id: "teal", value: "text-teal-400", preview: "#2dd4bf" },
    { id: "gray", value: "text-gray-400", preview: "#9ca3af" },
    { id: "white", value: "text-white", preview: "#ffffff" },
] as const

export const colorsMap = Object.fromEntries(
    COLLECTION_COLORS.map((c) => [c.id, c.value]),
) as Record<string, string>

export type CollectionColorId = (typeof COLLECTION_COLORS)[number]["id"]
