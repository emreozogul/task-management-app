import { DndContext, DragEndEvent, DragOverlay, useSensor, useSensors, PointerSensor, DragStartEvent, closestCorners } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { Column } from './Column';
import { useKanbanStore } from '@/stores/kanbanStore';
import { useTaskStore } from '@/stores/taskStore';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, X } from 'lucide-react';

export const Board = () => {
    const { boards, activeBoard, addColumn, moveTask } = useKanbanStore();
    const { getTaskById } = useTaskStore();
    const [activeId, setActiveId] = useState<string | null>(null);
    const [isAddingColumn, setIsAddingColumn] = useState(false);
    const [newColumnTitle, setNewColumnTitle] = useState('');

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    const findContainer = (id: string) => {
        if (!activeBoard) return null;
        const column = activeBoard.columns.find(col =>
            col.taskIds.includes(id)
        );
        if (column) return column.id;

        return activeBoard.columns.find(col => col.id === id)?.id || null;
    };

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        setActiveId(active.id.toString());
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveId(null);

        if (!over || !activeBoard) return;

        const activeId = active.id.toString();
        const overId = over.id.toString();

        const activeContainer = findContainer(activeId);
        const overContainer = findContainer(overId);

        if (!activeContainer || !overContainer) return;

        if (activeContainer !== overContainer) {
            moveTask(activeId, activeBoard.id, activeContainer, overContainer);
        } else {
            const column = activeBoard.columns.find(col => col.id === activeContainer);
            if (!column) return;

            const oldIndex = column.taskIds.indexOf(activeId);
            const newIndex = column.taskIds.indexOf(overId);

            if (oldIndex !== newIndex) {
                const newTaskIds = arrayMove(column.taskIds, oldIndex, newIndex);
                const updatedColumns = activeBoard.columns.map(col =>
                    col.id === activeContainer ? { ...col, taskIds: newTaskIds } : col
                );

                useKanbanStore.setState({
                    ...useKanbanStore.getState(),
                    boards: boards.map(board =>
                        board.id === activeBoard.id
                            ? { ...board, columns: updatedColumns }
                            : board
                    ),
                    activeBoard: {
                        ...activeBoard,
                        columns: updatedColumns,
                    },
                });
            }
        }
    };

    const handleAddColumn = (e: React.FormEvent) => {
        e.preventDefault();
        if (newColumnTitle.trim() && activeBoard) {
            addColumn(activeBoard.id, newColumnTitle.trim());
            setNewColumnTitle('');
            setIsAddingColumn(false);
        }
    };

    if (!activeBoard) return null;

    const activeTask = activeId ? getTaskById(activeId) : null;

    return (
        <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            collisionDetection={closestCorners}
        >
            <div className="flex gap-4 p-4 overflow-x-auto min-h-[calc(100vh-150px)]">
                {activeBoard.columns.map((column) => (
                    <Column
                        key={column.id}
                        id={column.id}
                        boardId={activeBoard.id}
                        title={column.title}
                        taskIds={column.taskIds}
                    />
                ))}

                <div className="w-80 min-w-[240px] shrink-0">
                    {isAddingColumn ? (
                        <form onSubmit={handleAddColumn} className="bg-[#232430] p-4 rounded-lg space-y-2">
                            <Input
                                type="text"
                                value={newColumnTitle}
                                onChange={(e) => setNewColumnTitle(e.target.value)}
                                placeholder="Enter column title..."
                                className="bg-[#383844] border-[#4e4e59] text-white"
                                autoFocus
                            />
                            <div className="flex gap-2">
                                <Button
                                    type="submit"
                                    className="bg-[#6775bc] hover:bg-[#7983c4] text-white flex-1"
                                    disabled={!newColumnTitle.trim()}
                                >
                                    Add
                                </Button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => {
                                        setIsAddingColumn(false);
                                        setNewColumnTitle('');
                                    }}
                                    className="text-white hover:bg-[#383844]"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        </form>
                    ) : (
                        <Button
                            onClick={() => setIsAddingColumn(true)}
                            variant="ghost"
                            className="w-full h-[calc(100vh-150px)] bg-[#232430] hover:bg-[#383844] text-[#95959c] hover:text-white"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Column
                        </Button>
                    )}
                </div>
            </div>
            <DragOverlay>
                {activeId && activeTask ? (
                    <div className="bg-[#383844] p-4 rounded-lg shadow mb-2 cursor-move text-white opacity-80">
                        {activeTask.title}
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    );
};