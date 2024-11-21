import { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Card } from './Card';
import { useTaskStore } from '@/stores/taskStore';
import { useKanbanStore } from '@/stores/kanbanStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, X, MoreVertical, Trash2 } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TaskSelector } from './TaskSelector';

interface ColumnProps {
    id: string;
    boardId: string;
    title: string;
    taskIds: string[];
}

export const Column = ({ id, boardId, title, taskIds }: ColumnProps) => {
    const { setNodeRef, isOver } = useDroppable({
        id: id,
        data: {
            type: 'column',
            columnId: id,
            boardId: boardId
        }
    });

    const { createTask, getTaskById } = useTaskStore();
    const { addTaskToColumn, removeTaskFromColumn, deleteColumn } = useKanbanStore();

    const [isAddingTask, setIsAddingTask] = useState(false);
    const [isTaskSelectorOpen, setIsTaskSelectorOpen] = useState(false);
    const [newTaskTitle, setNewTaskTitle] = useState('');

    const tasks = taskIds
        .map(taskId => getTaskById(taskId))
        .filter((task): task is NonNullable<ReturnType<typeof getTaskById>> => task !== undefined);

    const handleAddTask = (e: React.FormEvent) => {
        e.preventDefault();
        if (newTaskTitle.trim()) {
            const newTask = createTask({
                title: newTaskTitle.trim(),
            });
            addTaskToColumn(boardId, id, newTask.id);
            setNewTaskTitle('');
            setIsAddingTask(false);
        }
    };

    const handleRemoveTask = (taskId: string) => {
        removeTaskFromColumn(boardId, id, taskId);
    };

    const columnMenu = (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-[#383844]">
                    <MoreVertical className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-[#232430] border-[#383844]">
                <DropdownMenuItem
                    className="text-red-500 hover:text-red-400 hover:bg-[#383844] cursor-pointer"
                    onClick={() => deleteColumn(boardId, id)}
                >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Column
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );

    return (
        <div className="bg-[#232430] p-4 rounded-lg w-80 min-w-[300px] flex flex-col h-[calc(100vh-150px)]">
            <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-white">{title}</h2>
                {columnMenu}
            </div>

            <div
                ref={setNodeRef}
                className={`flex-1 overflow-y-auto min-h-0 space-y-3 rounded-lg transition-colors ${isOver ? 'bg-[#2a2b38]' : ''
                    }`}
            >
                <SortableContext
                    items={taskIds}
                    strategy={verticalListSortingStrategy}
                >
                    {tasks.length > 0 ? tasks.map((task) => (
                        <Card
                            key={task.id}
                            task={task}
                            onRemove={handleRemoveTask}
                        />
                    )) : (
                        <div className="h-20 rounded-lg border-2 border-dashed border-[#383844] bg-[#232430] transition-colors" />
                    )}
                </SortableContext>
            </div>

            <div className="mt-4 space-y-2">
                {isAddingTask ? (
                    <form onSubmit={handleAddTask} className="space-y-2">
                        <Input
                            type="text"
                            value={newTaskTitle}
                            onChange={(e) => setNewTaskTitle(e.target.value)}
                            placeholder="Enter task title..."
                            className="bg-[#383844] border-[#4e4e59] text-white"
                            autoFocus
                        />
                        <div className="flex gap-2">
                            <Button
                                type="submit"
                                className="bg-[#6775bc] hover:bg-[#7983c4] text-white flex-1"
                                disabled={!newTaskTitle.trim()}
                            >
                                Add
                            </Button>
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => {
                                    setIsAddingTask(false);
                                    setNewTaskTitle('');
                                }}
                                className="text-white hover:bg-[#383844]"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </form>
                ) : (
                    <>
                        <Button
                            onClick={() => setIsAddingTask(true)}
                            variant="ghost"
                            className="w-full text-[#95959c] hover:text-white hover:bg-[#383844]"
                        >
                            <Plus className="h-4 h-4 mr-2" />
                            Add Task
                        </Button>
                        <Button
                            onClick={() => setIsTaskSelectorOpen(true)}
                            variant="ghost"
                            className="w-full text-[#95959c] hover:text-white hover:bg-[#383844]"
                        >
                            <Plus className="h-4 h-4 mr-2" />
                            Add Existing Task
                        </Button>
                    </>
                )}
            </div>

            <TaskSelector
                open={isTaskSelectorOpen}
                onOpenChange={setIsTaskSelectorOpen}
                onTaskSelect={(taskId: string) => {
                    addTaskToColumn(boardId, id, taskId);
                }}
                excludeTaskIds={taskIds}
            />
        </div>
    );
};
