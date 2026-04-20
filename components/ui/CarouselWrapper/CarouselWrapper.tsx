"use client"
import useEmblaCarousel from "embla-carousel-react"
import Autoplay from "embla-carousel-autoplay"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useCallback } from "react"

export interface CarouselWrapperProps {
    children: React.ReactNode
    isNavButtons?: boolean
    autoplay?: boolean
    loop?: boolean
    dragFree?: boolean
}
export const CarouselWrapper = ({
    children,
    isNavButtons,
    autoplay = true,
    loop = true,
    dragFree = true,
}: CarouselWrapperProps) => {
    const [emblaRef, emblaApi] = useEmblaCarousel(
        { loop: loop, dragFree: dragFree },
        autoplay ? [Autoplay({ delay: 5000, stopOnInteraction: true })] : [],
    )
    const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
    const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

    return (
        <div className="group relative w-full">
            <div ref={emblaRef} className="scrollbar-none overflow-hidden">
                {children}
            </div>
            {isNavButtons && (
                <>
                    <button
                        onClick={scrollPrev}
                        className="absolute top-1/2 left-0.5 -translate-y-1/2 rounded-full bg-neutral-800/80 px-3 py-2.5 opacity-0 transition-opacity group-hover:opacity-100"
                    >
                        <ChevronLeft className="w-5 pr-px" />
                    </button>
                    <button
                        onClick={scrollNext}
                        className="absolute top-1/2 right-0.5 -translate-y-1/2 rounded-full bg-neutral-800/80 px-3 py-2.5 opacity-0 transition-opacity group-hover:opacity-100"
                    >
                        <ChevronRight className="w-5 pl-px" />
                    </button>
                </>
            )}
        </div>
    )
}
