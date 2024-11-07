import { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Card } from './Card';
import { KanbanTask } from '@/stores/kanbanStore';
import { useKanbanStore } from '@/stores/kanbanStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, X } from 'lucide-react';

interface ColumnProps {
    id: string;
    title: string;
    tasks: KanbanTask[];
}

export const Column = ({ id, title, tasks }: ColumnProps) => {
    const { setNodeRef } = useDroppable({
        id: id
    });
    const { addTask } = useKanbanStore();
    const [isAddingTask, setIsAddingTask] = useState(false);
    const [newTaskTitle, setNewTaskTitle] = useState('');

    const handleAddTask = (e: React.FormEvent) => {
        e.preventDefault();
        if (newTaskTitle.trim()) {
            addTask(id, {
                title: newTaskTitle.trim(),
            });
            setNewTaskTitle('');
            setIsAddingTask(false);
        }
    };

    return (
        <div className="bg-[#232430] p-4 rounded-lg w-80 min-w-[240px] flex flex-col h-[calc(100vh-200px)]">
            <h2 className="font-bold mb-4 text-white">{title}</h2>

            <div ref={setNodeRef} className="flex-1 overflow-y-auto min-h-0 space-y-2">
                <SortableContext items={tasks.map(task => task.id)} strategy={verticalListSortingStrategy}>
                    {tasks.map((task) => (
                        <Card
                            key={task.id}
                            id={task.id}
                            title={task.title}
                            documentId={task.documentId}
                            priority={task.priority}
                            columnId={id}
                            createdAt={task.createdAt}
                            updatedAt={task.updatedAt}
                        />
                    ))}
                </SortableContext>
            </div>

            <div className="mt-4">
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
                    <Button
                        onClick={() => setIsAddingTask(true)}
                        variant="ghost"
                        className="w-full text-[#95959c] hover:text-white hover:bg-[#383844]"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Task
                    </Button>
                )}
            </div>
        </div>
    );
};
