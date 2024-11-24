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
import { TaskSelector } from '../tasks/TaskSelector';
import { TaskPriority } from '@/types/task';
import { cn } from '@/lib/utils';

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
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const endDate = new Date(today);
            endDate.setDate(endDate.getDate() + 7);
            endDate.setHours(23, 59, 59, 999);

            const newTask = createTask({
                title: newTaskTitle.trim(),
                priority: TaskPriority.LOW,
                startDate: today.toISOString(),
                endDate: endDate.toISOString(),
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
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-background-hover">
                    <MoreVertical className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-background-secondary border-border">
                <DropdownMenuItem
                    className="text-destructive hover:text-destructive/90 hover:bg-background-hover cursor-pointer"
                    onClick={() => deleteColumn(boardId, id)}
                >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Column
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );

    return (
        <div className="bg-background-secondary p-4 rounded-lg w-80 min-w-[300px] flex flex-col h-[calc(100vh-120px)]">
            <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-primary-foreground">{title}</h2>
                {columnMenu}
            </div>

            <div
                ref={setNodeRef}
                className={cn(
                    "flex-1 overflow-y-auto min-h-0 space-y-3 rounded-lg transition-colors",
                    isOver && "bg-background-hover-dark"
                )}
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
                        <div className="h-20 rounded-lg border-2 border-dashed border-border bg-background-secondary transition-colors" />
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
                            className="bg-background-hover border-border text-primary-foreground"
                            autoFocus
                        />
                        <div className="flex gap-2">
                            <Button
                                type="submit"
                                className="bg-primary hover:bg-primary-hover text-primary-foreground flex-1"
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
                                className="text-primary-foreground hover:bg-background-hover"
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
                            className="w-full text-muted hover:text-primary-foreground hover:bg-background-hover"
                        >
                            <Plus className="h-4 h-4 mr-2" />
                            Add Task
                        </Button>
                        <Button
                            onClick={() => setIsTaskSelectorOpen(true)}
                            variant="ghost"
                            className="w-full text-muted hover:text-primary-foreground hover:bg-background-hover"
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
