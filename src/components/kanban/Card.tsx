import { useState, useRef, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FileText, Trash2, Calendar, Info, Clock } from 'lucide-react';
import { TaskSheet } from '../tasks/TaskSheet';
import { cn } from '@/lib/utils';
import { useTaskStore } from '@/stores/taskStore';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';
import { Textarea } from '../ui/textarea';
import { Task } from '@/types/task';

interface CardProps {
    task: Task;
    onRemove: (taskId: string) => void;
}

const priorityColors = {
    low: 'border-l-primary',
    medium: 'border-l-warning',
    high: 'border-l-destructive'
};

export const Card = ({ task, onRemove }: CardProps) => {
    const { updateTask } = useTaskStore();


    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState(task?.title || '');
    const { attributes, listeners, setNodeRef, transform } = useSortable({ id: task.id });
    const inputRef = useRef<HTMLTextAreaElement>(null);

    if (!task) return null;

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        onRemove(task.id);
    };

    const handleCheckboxChange = (checked: boolean) => {
        updateTask(task.id, { completed: checked });
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
            updateTask(task.id, { title: editedTitle.trim() });
        } else {
            setEditedTitle(task.title);
        }
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleTitleSubmit();
        } else if (e.key === 'Escape') {
            setEditedTitle(task.title);
            setIsEditing(false);
        }
    };

    const getDeadlineInfo = (startDate?: string, endDate?: string) => {
        if (!startDate || !endDate) return null;

        try {
            const start = new Date(startDate);
            const end = new Date(endDate);
            const now = new Date();
            const daysUntilEnd = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

            return {
                formattedStart: format(start, 'MMM dd'),
                formattedEnd: format(end, 'MMM dd'),
                daysUntil: daysUntilEnd,
                status: daysUntilEnd < 0 ? 'overdue' :
                    daysUntilEnd === 0 ? 'due-today' :
                        daysUntilEnd <= 2 ? 'upcoming' :
                            'normal'
            };
        } catch (error) {
            console.error('Error formatting dates:', error);
            return null;
        }
    };

    const deadlineInfo = getDeadlineInfo(task.startDate || undefined, task.endDate || undefined);

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
                    "group bg-background-hover rounded-lg shadow-sm cursor-move transition-all duration-200 w-[260px] shrink-0",
                    "hover:bg-background-hover-dark",
                    "border-[5px] border-transparent",
                    priorityColors[task.priority],
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
                                checked={task.completed}
                                onCheckedChange={handleCheckboxChange}
                                className="border-primary w-5 h-5 data-[state=checked]:bg-primary"
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
                                className="flex-1 min-w-0 text-primary-foreground text-sm py-0 resize-none bg-transparent border-0 focus:ring-0 focus:ring-offset-0 outline-none shadow-none pr-16 focus-visible:ring-0 border-b-2 border-transparent"
                                autoFocus
                            />
                        ) : (
                            <span
                                className={cn(
                                    "text-primary-foreground text-sm flex-1 min-w-0 break-words transition-opacity duration-200",
                                    task.completed && "line-through opacity-60",
                                    "group-hover:opacity-10"
                                )}
                                onDoubleClick={handleDoubleClick}
                            >
                                {task.title}
                            </span>
                        )}
                        <div className={cn(
                            "flex items-center gap-1 absolute right-0 top-1/2 -translate-y-1/2 flex-shrink-0",
                            isEditing && "opacity-0"
                        )}>
                            <Button
                                variant="ghost"
                                onClick={() => setIsSheetOpen(true)}
                                className="w-8 h-8 opacity-0 translate-x-4 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-200 delay-100 rounded-full bg-background-hover"
                            >
                                <Info className="w-4 h-4 text-primary" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleDelete}
                                className="w-8 h-8 opacity-0 translate-x-4 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-200 delay-75 rounded-full bg-background-hover-dark"
                            >
                                <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                        </div>
                    </div>

                    {(task.startDate || task.endDate) && (
                        <div className={cn(
                            "flex items-center gap-2 mt-2 ml-7 text-xs text-muted transition-opacity duration-200",
                            "group-hover:opacity-30"
                        )}>
                            {task.documentId && <FileText className="w-3.5 h-3.5 text-primary" />}
                            {task.startDate && task.endDate && (
                                <div className="flex items-center gap-1">
                                    <Calendar className="w-3.5 h-3.5" />
                                    {deadlineInfo && (
                                        <div className={cn(
                                            "flex items-center gap-1 text-xs px-2 py-1 rounded-md",
                                            {
                                                'bg-destructive/20 text-destructive': deadlineInfo.status === 'overdue',
                                                'bg-orange-500/20 text-orange-400': deadlineInfo.status === 'due-today',
                                                'bg-warning/20 text-warning': deadlineInfo.status === 'upcoming',
                                                'bg-muted/20 text-muted': deadlineInfo.status === 'normal',
                                            }
                                        )}>
                                            <Clock className="w-3 h-3" />
                                            {deadlineInfo.status === 'overdue' && 'Overdue'}
                                            {deadlineInfo.status === 'due-today' && 'Due today'}
                                            {deadlineInfo.status === 'upcoming' && `Due in ${deadlineInfo.daysUntil} days`}
                                            {deadlineInfo.status === 'normal' &&
                                                `${deadlineInfo.formattedStart} - ${deadlineInfo.formattedEnd}`}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {isSheetOpen && (
                <TaskSheet
                    open={isSheetOpen}
                    onOpenChange={setIsSheetOpen}
                    taskId={task.id}
                    task={task}
                />
            )}
        </>
    );
};
