import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FileText } from 'lucide-react';
import { TaskSheet } from './TaskSheet';
import { cn } from '@/lib/utils';

interface CardProps {
    id: string;
    title: string;
    priority: 'low' | 'medium' | 'high';
    documentId?: string;
    columnId: string;
    createdAt: Date;
    updatedAt: Date;
}

const priorityColors = {
    low: 'border-l-[#383844]',
    medium: 'border-l-[#6775bc]',
    high: 'border-l-[#bc6767]'
};

export const Card = ({ id, title, priority, documentId, columnId, createdAt, updatedAt }: CardProps) => {
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const { attributes, listeners, setNodeRef, transform } = useSortable({ id });

    const cardClassName = cn(
        "p-4 rounded-lg shadow mb-2 cursor-move text-white hover:opacity-90 transition-colors group bg-[#383844] border-l-4",
        priorityColors[priority],
        transform ? `translate-[${CSS.Transform.toString(transform)}]` : ''
    );

    return (
        <>
            <div
                ref={setNodeRef}
                className={cardClassName}
                {...attributes}
                {...listeners}
                onClick={() => setIsSheetOpen(true)}
            >
                <div className="flex items-center justify-between">
                    <span>{title}</span>
                    {documentId && (
                        <FileText className="w-4 h-4 text-[#6775bc] opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                </div>
            </div>
            <TaskSheet
                open={isSheetOpen}
                onOpenChange={setIsSheetOpen}
                taskId={id}
                columnId={columnId}
                task={{ id, title, priority, documentId, columnId, createdAt, updatedAt }}
            />
        </>
    );
};
