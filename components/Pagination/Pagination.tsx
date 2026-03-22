import {
    ChevronFirst,
    ChevronLast,
    ChevronLeft,
    ChevronRight,
} from "lucide-react"
import { PaginationButton } from "./PaginationButton/PaginationButton"

interface PaginationProps {
    page: number
    totalPages: number
    isLoading: boolean
    onPageChange: (page: number) => void
}

export const Pagination = ({
    page,
    isLoading,
    onPageChange,
    totalPages,
}: PaginationProps) => (
    <div className="flex flex-col">
        <div className="mt-8 flex items-center justify-center gap-1">
            <PaginationButton
                className="px-3"
                onClick={() => onPageChange(0)}
                disabled={page === 0 || isLoading}
            >
                <ChevronFirst className="w-5" />
            </PaginationButton>
            <PaginationButton
                className="px-3"
                onClick={() => onPageChange(page - 1)}
                disabled={page === 0 || isLoading}
            >
                <ChevronLeft className="w-5" />
            </PaginationButton>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const pageNum = Math.max(0, page - 2) + i
                if (pageNum >= totalPages) return null
                return (
                    <PaginationButton
                        key={i}
                        onClick={() => onPageChange(pageNum)}
                        disabled={pageNum === page || isLoading}
                        className={`${pageNum === page ? "border-white bg-white text-black disabled:opacity-100" : ""}`}
                    >
                        {pageNum + 1}
                    </PaginationButton>
                )
            })}
            <PaginationButton
                onClick={() => onPageChange(page + 1)}
                disabled={page >= totalPages - 1 || isLoading}
                className="px-3"
            >
                <ChevronRight className="w-5" />
            </PaginationButton>
            <PaginationButton
                className="px-3"
                onClick={() => onPageChange(totalPages - 1)}
                disabled={page >= totalPages - 1 || isLoading}
            >
                <ChevronLast className="w-5" />
            </PaginationButton>
        </div>
        <span className="mx-auto mt-5 text-sm text-neutral-500">
            Страница {page + 1} из {totalPages}
        </span>
    </div>
)
