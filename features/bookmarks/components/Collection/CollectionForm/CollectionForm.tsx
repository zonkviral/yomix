import { useState } from "react"

import { ToggleSwitch } from "@/components/ui/ToggleSwitch/ToggleSwitch"

import { IconPicker } from "../../IconPicker/IconPicker"
import { CollectionColorPicker } from "../CollectionColorPicker/CollectionColorPicker"

import { useBookmarksStore } from "../../../store/bookmarks.store"

import { Collection } from "@/lib/supabase/type"

import { CircleAlertIcon } from "lucide-react"

interface CollectionFormProps {
    onSuccess: () => void
    collection?: Collection
}

export const CollectionForm = ({
    onSuccess,
    collection,
}: CollectionFormProps) => {
    const { createCollection, updateCollection } = useBookmarksStore()

    const [name, setName] = useState(collection?.name ?? "")
    const [icon, setIcon] = useState(collection?.icon ?? "")
    const [color, setColor] = useState(collection?.color ?? "")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [isPublic, setIsPublic] = useState(collection?.is_public ?? false)

    const isEdit = !!collection

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)

        const result = isEdit
            ? await updateCollection(
                  collection.id,
                  name.trim(),
                  icon,
                  color,
                  isPublic,
              )
            : await createCollection(name.trim(), icon, color, isPublic)

        if (result.error) {
            setError(result.error)
            setLoading(false)
            return
        }

        setLoading(false)
        onSuccess()
    }

    return (
        <div className="mx-auto">
            <h2 className="mb-4 text-lg font-semibold">
                {isEdit ? "Редактировать коллекцию" : "Создать коллекцию"}
            </h2>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <fieldset className="flex flex-col gap-2">
                    <legend className="pb-2 pl-0.5 text-sm text-white/40">
                        Название коллекции
                    </legend>
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        type="text"
                        required
                        placeholder="Например: Любимые манги"
                        className="w-full rounded-md border border-neutral-700 bg-neutral-800 p-2 text-sm text-white focus:ring-2 focus:ring-rose-600 focus:outline-none"
                    />
                    {(name.length === 0 || name.length > 32) && (
                        <div className="flex text-red-400">
                            <CircleAlertIcon className="w-4" />
                            <p className="self-center pl-1 text-sm">
                                {name.length === 0
                                    ? "Название не может быть пустым"
                                    : "Название не может быть длиннее 32 символов"}
                            </p>
                        </div>
                    )}
                </fieldset>
                <fieldset className="flex flex-col gap-2">
                    <legend className="pb-2 pl-0.5 text-sm text-white/40">
                        Цвет коллекции
                    </legend>
                    <CollectionColorPicker value={color} onChange={setColor} />
                </fieldset>
                <fieldset className="flex flex-col gap-2">
                    <legend className="pb-2 pl-0.5 text-sm text-white/40">
                        Иконка коллекции
                    </legend>
                    <IconPicker value={icon} onChange={setIcon} />
                </fieldset>
                <fieldset className="w-full">
                    <legend className="sr-only">Публичная</legend>
                    <label
                        htmlFor="is-public-toggle"
                        className="bg-surface border-secondary flex w-full cursor-pointer items-center justify-between gap-4 rounded-md border px-3 py-2 text-sm focus-within:ring-2 focus-within:ring-rose-600"
                    >
                        <div className="flex flex-col">
                            <span className="font-medium">Публичная</span>
                            <span className="text-xs text-white/50">
                                Будет видна всем пользователям
                            </span>
                        </div>
                        <ToggleSwitch
                            checked={isPublic}
                            onChange={setIsPublic}
                            id="is-public-toggle"
                        />
                    </label>
                </fieldset>
                {error && <p className="text-sm text-rose-500">{error}</p>}
                <button
                    type="submit"
                    disabled={loading || name.length > 32}
                    className="self-end rounded-md bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-500 disabled:opacity-50"
                >
                    {loading
                        ? isEdit
                            ? "Сохранение..."
                            : "Создание..."
                        : isEdit
                          ? "Сохранить"
                          : "Создать"}
                </button>
            </form>
        </div>
    )
}
