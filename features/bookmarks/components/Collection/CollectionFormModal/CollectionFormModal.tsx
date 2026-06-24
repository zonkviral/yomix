import { useCallback, useState } from "react"

import { ToggleSwitch } from "@/components/ui/ToggleSwitch/ToggleSwitch"
import { Modal } from "@/components/ui/Modal/Modal"

import { IconPicker } from "../../IconPicker/IconPicker"
import { CollectionColorPicker } from "../CollectionColorPicker/CollectionColorPicker"

import { useBookmarksStore } from "../../../store/bookmarks.store"

import { cn } from "@/utils/cn"

import { Collection } from "@/lib/supabase/type"

import { CircleAlertIcon } from "lucide-react"

interface CollectionFormProps {
    isOpen: boolean
    close: () => void
    collection?: Collection
}

export const CollectionFormModal = ({
    isOpen,
    close,
    collection,
}: CollectionFormProps) => {
    const { createCollection, updateCollection } = useBookmarksStore()

    const [name, setName] = useState(collection?.name ?? "")
    const [icon, setIcon] = useState(collection?.icon ?? "")
    const [color, setColor] = useState(collection?.color ?? "")
    const [isPublic, setIsPublic] = useState(collection?.is_public ?? false)

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const isEdit = !!collection

    const nameInput = useCallback((inputElement: HTMLInputElement | null) => {
        if (inputElement) {
            inputElement.focus()
        }
    }, [])

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
        close()
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={close}
            className="backdrop:backdrop-blur-[2px]"
        >
            <div className="text-amber-50 md:min-w-80">
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
                            ref={nameInput}
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
                        <CollectionColorPicker
                            value={color}
                            onChange={setColor}
                        />
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
                        disabled={
                            loading || name.length > 32 || name.length < 0
                        }
                        className={cn(
                            "self-end rounded-md bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-500",
                            "disabled:cursor-not-allowed! disabled:opacity-50 disabled:hover:bg-rose-600",
                        )}
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
        </Modal>
    )
}
