import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from "@dnd-kit/core"

import {
    SortableContext,
    verticalListSortingStrategy,
    arrayMove,
    useSortable,
} from "@dnd-kit/sortable"

import { CSS } from "@dnd-kit/utilities"

import { GripHorizontal } from "lucide-react"

interface SortableListProps<T extends { id: string }> {
    items: T[]
    onReorder: (items: T[]) => void
    renderItem: (item: T, dragHandle: React.ReactNode) => React.ReactNode
    className?: string
}

const SortableItem = <T extends { id: string }>({
    item,
    renderItem,
}: {
    item: T
    renderItem: (item: T, dragHandle: React.ReactNode) => React.ReactNode
}) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: item.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    }

    const dragHandle = (
        <button
            {...attributes}
            {...listeners}
            className="cursor-grab text-white/20 hover:text-white/50 active:cursor-grabbing"
            onClick={(e) => e.stopPropagation()}
        >
            <GripHorizontal className="w-4" />
        </button>
    )

    return (
        <div ref={setNodeRef} style={style}>
            {renderItem(item, dragHandle)}
        </div>
    )
}

export const SortableList = <T extends { id: string }>({
    items,
    onReorder,
    renderItem,
    className,
}: SortableListProps<T>) => {
    const sensors = useSensors(useSensor(PointerSensor))

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event
        if (!over || active.id === over.id) return

        const oldIndex = items.findIndex((i) => i.id === active.id)
        const newIndex = items.findIndex((i) => i.id === over.id)
        onReorder(arrayMove(items, oldIndex, newIndex))
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <SortableContext
                items={items.map((i) => i.id)}
                strategy={verticalListSortingStrategy}
            >
                <div className={className}>
                    {items.map((item) => (
                        <SortableItem
                            key={item.id}
                            item={item}
                            renderItem={renderItem}
                        />
                    ))}
                </div>
            </SortableContext>
        </DndContext>
    )
}
