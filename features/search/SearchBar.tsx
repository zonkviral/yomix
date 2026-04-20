"use client"

import { Modal } from "@/components/ui/Modal/Modal"

import { SearchModal } from "./SearchModal"

import { useModal } from "@/hooks/useModal"

import { Search } from "lucide-react"

export const SearchBar = () => {
    const { open, isOpen, close } = useModal()

    return (
        <>
            <button
                className="r-auto flex h-fit items-center justify-items-center rounded-2xl bg-neutral-950 px-6 py-2"
                onClick={open}
            >
                <Search size={16} className="mr-2" />
                <span>Поиск</span>
            </button>
            <Modal
                isOpen={isOpen}
                onClose={close}
                className="mx-auto mt-4 w-full max-w-3xl text-amber-50"
                hideCloseButton
            >
                <SearchModal closeModal={close} />
            </Modal>
        </>
    )
}
