import { useDraggable } from '@dnd-kit/core';
import { Badge } from '@/components/ui/badge';
import { FileText } from 'lucide-react';
import { Task } from '@/types/task';

interface CalendarTaskProps {
    task: Task;
    onClick: (task: Task) => void;
}

export const CalendarTask = ({ task, onClick }: CalendarTaskProps) => {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: task.id,
    });

    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            onClick={() => onClick(task)}
            style={{
                opacity: isDragging ? 0.4 : 1,
                transform: isDragging ? 'scale(1.05)' : undefined,
            }}
            className={`bg-[#232430] rounded-md p-1.5 cursor-grab active:cursor-grabbing
                hover:bg-[#383844] transition-all duration-200 group
                ${isDragging ? 'ring-2 ring-[#6775bc]' : ''}
            `}
        >
            <div className="text-[10px] text-white font-medium truncate group-hover:text-[#6775bc]">
                {task.title}
            </div>
            <div className="flex items-center gap-1 mt-1">
                <Badge
                    variant={
                        task.priority === 'high' ? 'destructive' :
                            task.priority === 'medium' ? 'default' : 'secondary'
                    }
                    className="text-[8px] px-1 py-0"
                >
                    {task.priority}
                </Badge>
                {task.documentId && (
                    <FileText className="w-2.5 h-2.5 text-[#6775bc]" />
                )}
            </div>
        </div>
    );
};