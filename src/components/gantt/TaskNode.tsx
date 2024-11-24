import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { memo } from 'react';
import { Task, TaskPriority } from '@/types/task';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface TaskNodeProps {
    data: {
        label: string;
        startOffset: number;
        duration: number;
        priority: TaskPriority;
        task: Task;
        dayWidth: number;
    };
}

export const TaskNode = memo(({ data }: TaskNodeProps) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: data.task.id,
    });

    const startX = data.startOffset * data.dayWidth;
    const width = data.duration * data.dayWidth;

    const getPriorityStyles = (priority: TaskPriority) => {
        switch (priority) {
            case TaskPriority.HIGH:
                return {
                    base: 'bg-destructive',
                    hover: 'hover:bg-[#ff5555]',
                };
            case TaskPriority.MEDIUM:
                return {
                    base: 'bg-warning',
                    hover: 'hover:bg-[#fbbf24]',
                };
            default:
                return {
                    base: 'bg-primary',
                    hover: 'hover:bg-primary-hover',
                };
        }
    };

    const styles = getPriorityStyles(data.priority);

    return (
        <div
            ref={setNodeRef}
            {...attributes}
            {...listeners}
            className="absolute left-0 h-[50px] flex items-center cursor-move"
            style={{
                transform: CSS.Transform.toString(transform),
                left: `${startX}px`
            }}
        >
            <div
                className={cn(
                    "h-8 rounded-lg flex items-center px-3 cursor-pointer",
                    "transition-all duration-200",
                    "hover:shadow-lg hover:shadow-black/5",
                    styles.base,
                    styles.hover,
                    "text-white"
                )}
                style={{ width: `${width}px` }}
            >
                <div className="flex items-center gap-2 min-w-0 w-full">
                    <span className="text-sm font-medium truncate">
                        {data.label}
                    </span>
                    {data.duration > 1 && (
                        <span className="text-xs opacity-80 flex-shrink-0">
                            {data.duration}d
                        </span>
                    )}
                </div>

                <div className="absolute left-0 top-full mt-2 bg-background-hover rounded-lg p-3 
                            opacity-0 group-hover:opacity-100 transition-opacity duration-200
                            pointer-events-none z-50 w-72 border border-border shadow-xl shadow-black/20">
                    <div className="flex items-center gap-2 mb-2">
                        <div className={cn("w-full h-1 rounded-full", styles.base)} />
                        <h4 className="font-medium text-primary-foreground">{data.task.title}</h4>
                    </div>

                    {data.task.description && (
                        <p className="text-muted text-sm mb-3 line-clamp-2">
                            {data.task.description}
                        </p>
                    )}

                    <div className="space-y-1.5 text-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-muted">Duration</span>
                            <span className="text-primary-foreground/80">{data.duration} days</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-muted">Start</span>
                            <span className="text-primary-foreground/80">
                                {format(new Date(data.task.startDate!), 'MMM dd, yyyy')}
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-muted">End</span>
                            <span className="text-primary-foreground/80">
                                {format(new Date(data.task.endDate!), 'MMM dd, yyyy')}
                            </span>
                        </div>

                        {data.task.labels?.length > 0 && (
                            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
                                <span className="text-muted">Tags:</span>
                                <div className="flex flex-wrap gap-1">
                                    {data.task.labels.map(label => (
                                        <span
                                            key={label}
                                            className="px-1.5 py-0.5 rounded-md text-xs bg-background-hover text-primary-foreground/70"
                                        >
                                            {label}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
});

TaskNode.displayName = 'TaskNode';