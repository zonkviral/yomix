import { BASE_URL } from "./constants"

export const getMangaById = async (id: string) => {
    const res = await fetch(`${BASE_URL}/manga/${id}`)
    const data = await res.json()
    return data.data
}
