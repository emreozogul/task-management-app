import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { Column } from './Column';
import { useKanbanStore } from '../../stores/kanbanStore';

export const Board = () => {
    const { activeBoard, moveCard } = useKanbanStore();

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const cardId = active.id as string;
            const sourceColumn = active.data.current?.sortable.containerId;
            const targetColumn = over.id as string;

            moveCard(cardId, sourceColumn, targetColumn);
        }
    };

    if (!activeBoard) {
        return <div>No board selected</div>;
    }

    return (
        <DndContext onDragEnd={handleDragEnd}>
            <div className="flex gap-4 p-4 overflow-x-auto">
                {activeBoard.columns.map((column) => (
                    <Column
                        key={column.id}
                        id={column.id}
                        title={column.title}
                        cards={column.cards}
                    />
                ))}
            </div>
        </DndContext>
    );
};