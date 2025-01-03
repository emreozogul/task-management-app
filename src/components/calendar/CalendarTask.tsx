import { useDraggable } from '@dnd-kit/core';
import { Badge } from '@/components/ui/badge';
import { FileText } from 'lucide-react';
import { Task, TaskPriority } from '@/types/task';
import { TaskSheet } from '../tasks/TaskSheet';
import { useState } from 'react';

interface CalendarTaskProps {
    task: Task;
}

export const CalendarTask = ({ task }: CalendarTaskProps) => {
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: task.id,
    });

    const handleTaskClick = () => {
        setIsSheetOpen(true);
    };

    return (
        <>
            <div
                ref={setNodeRef}
                style={{
                    opacity: isDragging ? 0.4 : 1,
                    transform: isDragging ? 'scale(1.05)' : undefined,
                }}
                className="bg-background-secondary rounded-md p-1.5 cursor-pointer hover:bg-background-hover transition-all duration-200 relative group/task"
            >
                <div {...attributes} {...listeners} className="absolute inset-0 z-10" />

                <div onClick={handleTaskClick} className="relative z-20">
                    <div className="min-w-0 flex-1">
                        <div className="text-[10px] text-primary-foreground font-medium truncate">
                            {task.title}
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                            <Badge
                                variant={
                                    task.priority === TaskPriority.HIGH ? 'destructive' :
                                        task.priority === TaskPriority.MEDIUM ? 'default' : 'secondary'
                                }
                                className="text-[8px] px-1 py-0"
                            >
                                {task.priority}
                            </Badge>
                            {task.documentId && (
                                <FileText className="w-2.5 h-2.5 text-primary" />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <TaskSheet
                key={task.id}
                open={isSheetOpen}
                onOpenChange={setIsSheetOpen}
                taskId={task.id}
                task={task}
            />
        </>
    );
};