import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FileText, Trash2, Calendar } from 'lucide-react';
import { TaskSheet } from './TaskSheet';
import { cn } from '@/lib/utils';
import { useKanbanStore } from '@/stores/kanbanStore';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';

interface CardProps {
    id: string;
    title: string;
    priority: 'low' | 'medium' | 'high';
    documentId?: string;
    columnId: string;
    createdAt: Date;
    updatedAt: Date;
    completed: boolean;
    labels: string[];
    deadline?: string;
}

const priorityColors = {
    low: 'border-l-[#383844]',
    medium: 'border-l-[#6775bc]',
    high: 'border-l-[#bc6767]'
};

export const Card = ({ id, title, priority, documentId, columnId, createdAt, updatedAt, completed, labels, deadline }: CardProps) => {
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const { attributes, listeners, setNodeRef, transform } = useSortable({ id });
    const { deleteTask, updateTask } = useKanbanStore();

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        deleteTask(columnId, id);
    };

    const handleCheckboxChange = (e: React.MouseEvent, checked: boolean) => {
        e.stopPropagation();
        updateTask(columnId, id, { completed: checked });
    };

    return (
        <>
            <div
                ref={setNodeRef}
                className={cn(
                    "group bg-[#383844] rounded-lg shadow-sm border-l-4 cursor-move",
                    priorityColors[priority],
                    transform ? `translate-[${CSS.Transform.toString(transform)}]` : ''
                )}
                {...attributes}
                {...listeners}
                onClick={() => setIsSheetOpen(true)}
            >
                <div className="p-3">
                    <div className="flex items-center gap-3">
                        <div onClick={(e) => e.stopPropagation()}>
                            <Checkbox
                                checked={completed}
                                onCheckedChange={(checked) => handleCheckboxChange({} as React.MouseEvent, checked as boolean)}
                                className="border-[#6775bc]"
                            />
                        </div>
                        <span className={cn(
                            "text-white text-sm",
                            completed && "line-through opacity-60"
                        )}>
                            {title}
                        </span>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleDelete}
                            className="ml-auto p-1 opacity-0 group-hover:opacity-100 hover:bg-red-500/10"
                        >
                            <Trash2 className="w-3.5 h-3.5 text-red-500" />
                        </Button>
                    </div>

                    {(deadline || documentId) && (
                        <div className="flex items-center gap-2 mt-2 ml-7 text-xs text-gray-400">
                            {documentId && <FileText className="w-3.5 h-3.5 text-[#6775bc]" />}
                            {deadline && (
                                <div className="flex items-center gap-1">
                                    <Calendar className="w-3.5 h-3.5" />
                                    <span>{format(new Date(deadline), 'MMM dd')}</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
            <TaskSheet
                open={isSheetOpen}
                onOpenChange={setIsSheetOpen}
                taskId={id}
                columnId={columnId}
                task={{ id, title, priority, documentId, columnId, createdAt, updatedAt, completed, labels, deadline }}
            />
        </>
    );
};
