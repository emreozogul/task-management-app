import { DndContext, DragEndEvent, DragOverlay, useSensor, useSensors, PointerSensor, DragStartEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { Column } from './Column';
import { useKanbanStore } from '@/stores/kanbanStore';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, X } from 'lucide-react';

export const Board = () => {
    const { activeBoard, moveTask, addColumn } = useKanbanStore();
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

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id.toString());
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveId(null);

        if (!over || !activeBoard) return;

        const taskId = active.id as string;
        const overId = over.id as string;

        // Find source column
        const sourceColumn = activeBoard.columns.find(col =>
            col.tasks.some(task => task.id === taskId)
        );

        if (!sourceColumn) return;

        // Find target column and task indices
        const targetColumn = activeBoard.columns.find(col =>
            col.tasks.some(task => task.id === overId) || col.id === overId
        );

        if (!targetColumn) return;

        const isSameColumn = sourceColumn.id === targetColumn.id;
        const overTask = targetColumn.tasks.find(task => task.id === overId);

        if (isSameColumn) {
            // Reordering within the same column
            const oldIndex = sourceColumn.tasks.findIndex(task => task.id === taskId);
            const newIndex = overTask
                ? targetColumn.tasks.findIndex(task => task.id === overId)
                : targetColumn.tasks.length;

            const newTasks = arrayMove(sourceColumn.tasks, oldIndex, newIndex);

            const updatedColumns = activeBoard.columns.map(col =>
                col.id === sourceColumn.id ? { ...col, tasks: newTasks } : col
            );

            useKanbanStore.setState({
                ...useKanbanStore.getState(),
                activeBoard: {
                    ...activeBoard,
                    columns: updatedColumns,
                },
                boards: useKanbanStore.getState().boards.map(board =>
                    board.id === activeBoard.id
                        ? { ...board, columns: updatedColumns }
                        : board
                ),
            });
        } else {
            // Moving to a different column
            moveTask(taskId, sourceColumn.id, targetColumn.id);
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

    const activeTask = activeId ? activeBoard.columns
        .flatMap(col => col.tasks)
        .find(task => task.id === activeId) : null;

    return (
        <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className="flex gap-4 p-4 overflow-x-auto">
                {activeBoard.columns.map((column) => (
                    <Column
                        key={column.id}
                        id={column.id}
                        title={column.title}
                        tasks={column.tasks}
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