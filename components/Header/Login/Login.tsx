"use client"

import { LoginModal } from "./LoginModal"

import { Modal } from "@/components/Modal/Modal"

import { useModal } from "@/hooks/useModal"

import { LogIn } from "lucide-react"

export const Login = () => {
    const { isOpen, close, open } = useModal()

    return (
        <div className="ml-auto flex items-center gap-3">
            <button className="p-2" onClick={open}>
                <LogIn />
            </button>
            <Modal
                isOpen={isOpen}
                onClose={close}
                className="mx-auto text-amber-50"
            >
                <LoginModal />
            </Modal>
        </div>
    )
}
