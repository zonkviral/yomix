"use client"
import useEmblaCarousel from "embla-carousel-react"
import Autoplay from "embla-carousel-autoplay"

import { JSX } from "react"

export interface ModalProps {
    children: JSX.Element
}
export const CarouselWrapper: React.FC<ModalProps> = ({ children }) => {
    const [emblaRef] = useEmblaCarousel({ loop: true, dragFree: true }, [
        Autoplay({ delay: 5000, stopOnInteraction: true }),
    ])

    return (
        <div className="relative group w-full">
            <div ref={emblaRef} className="overflow-hidden scrollbar-none">
                {children}
            </div>
        </div>
    )
}
