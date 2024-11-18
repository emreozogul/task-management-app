import { useState, useRef, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FileText, Trash2, Calendar, Info } from 'lucide-react';
import { TaskSheet } from './TaskSheet';
import { cn } from '@/lib/utils';
import { useKanbanStore } from '@/stores/kanbanStore';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';
import { Textarea } from '../ui/textarea';
import { TaskPriority } from '@/types/task';

interface CardProps {
    id: string;
    title: string;
    priority: TaskPriority;
    documentId?: string;
    columnId: string;
    createdAt: string;
    updatedAt: string;
    completed: boolean;
    labels: string[];
    deadline?: string;
}

const priorityColors = {
    low: 'border-l-white',
    medium: 'border-l-[#6775bc]',
    high: 'border-l-[#bc6767]'
};

export const Card = ({ id, title, priority, documentId, columnId, createdAt, updatedAt, completed, labels, deadline }: CardProps) => {
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState(title);
    const { attributes, listeners, setNodeRef, transform } = useSortable({ id });
    const { deleteTask, updateTask } = useKanbanStore();
    const inputRef = useRef<HTMLTextAreaElement>(null);

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        deleteTask(columnId, id);
    };

    const handleCheckboxChange = (checked: boolean) => {
        updateTask(columnId, id, { completed: checked });
    };

    const handleDoubleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsEditing(true);
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setEditedTitle(e.target.value);
    };

    const handleTitleSubmit = () => {
        if (editedTitle.trim() !== '') {
            updateTask(columnId, id, { title: editedTitle.trim() });
        } else {
            setEditedTitle(title);
        }
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleTitleSubmit();
        } else if (e.key === 'Escape') {
            setEditedTitle(title);
            setIsEditing(false);
        }
    };

    const formatDeadline = (dateString?: string) => {
        if (!dateString) return null;
        try {
            const date = new Date(dateString);
            return format(date, 'MMM dd');
        } catch (error) {
            console.error('Error formatting deadline:', error);
            return null;
        }
    };

    useEffect(() => {
        console.log('Card deadline:', deadline);
    }, [deadline]);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isEditing]);

    return (
        <>
            <div
                ref={setNodeRef}
                className={cn(
                    "group bg-[#383844] rounded-lg shadow-sm cursor-move transition-all duration-200 w-[260px] shrink-0",
                    "hover:bg-[#1a1b23]",
                    "border-[5px] border-transparent",
                    priorityColors[priority],
                    transform ? `translate-[${CSS.Transform.toString(transform)}]` : ''
                )}
                {...attributes}
                {...listeners}
            >
                <div className="p-3">
                    <div className="flex items-center gap-3 relative min-h-[32px]">
                        <div
                            onClick={(e) => e.stopPropagation()}
                            className="flex-shrink-0 flex items-center justify-center"
                        >
                            <Checkbox
                                checked={completed}
                                onCheckedChange={handleCheckboxChange}
                                className="border-[#6775bc] w-5 h-5 data-[state=checked]:bg-[#6775bc] "
                            />
                        </div>
                        {isEditing ? (
                            <Textarea
                                ref={inputRef}
                                value={editedTitle}
                                onChange={handleTitleChange}
                                onBlur={handleTitleSubmit}
                                onKeyDown={handleKeyDown}
                                onClick={(e) => e.stopPropagation()}
                                className="flex-1 min-w-0 text-white text-sm py-0 resize-none bg-transparent border-0 focus:ring-0 focus:ring-offset-0 outline-none shadow-none pr-16 focus-visible:ring-0 border-b-2 border-transparent"
                                autoFocus
                            />
                        ) : (
                            <span
                                className={cn(
                                    "text-white text-sm flex-1 min-w-0 break-words  transition-opacity duration-200",
                                    completed && "line-through opacity-60",
                                    "group-hover:opacity-10"
                                )}
                                onDoubleClick={handleDoubleClick}
                            >
                                {title}
                            </span>
                        )}
                        <div className={cn(
                            "flex items-center gap-1 absolute right-0 top-1/2 -translate-y-1/2 flex-shrink-0",
                            isEditing && "opacity-0"
                        )}>
                            <Button
                                variant="ghost"
                                onClick={() => setIsSheetOpen(true)}
                                className="w-8 h-8 opacity-0 translate-x-4 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-200 delay-100 rounded-full bg-[#2a2b38]"
                            >
                                <Info className="w-4 h-4 text-[#6775bc]" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleDelete}
                                className="w-8 h-8 opacity-0 translate-x-4 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-200 delay-75 rounded-full bg-[#2a2b38]"
                            >
                                <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                        </div>
                    </div>

                    {(deadline || documentId) && (
                        <div className={cn(
                            "flex items-center gap-2 mt-2 ml-7 text-xs text-gray-400 transition-opacity duration-200",
                            "group-hover:opacity-30"
                        )}>
                            {documentId && <FileText className="w-3.5 h-3.5 text-[#6775bc]" />}
                            {deadline && (
                                <div className="flex items-center gap-1">
                                    <Calendar className="w-3.5 h-3.5" />
                                    <span>{formatDeadline(deadline)}</span>
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
                task={{ id, title, priority, documentId, columnId, createdAt, updatedAt, completed, labels, deadline: deadline || null }}
            />
        </>
    );
};
