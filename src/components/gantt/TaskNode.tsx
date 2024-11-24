import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { memo } from 'react';
import { Task } from '@/types/task';
import { format } from 'date-fns';

interface TaskNodeProps {
    data: {
        label: string;
        startOffset: number;
        duration: number;
        priority: string;
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

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high':
                return {
                    background: 'bg-destructive/10',
                    border: 'border-destructive/20',
                    text: 'text-destructive',
                    hover: 'hover:border-destructive/50'
                };
            case 'medium':
                return {
                    background: 'bg-warning/10',
                    border: 'border-warning/20',
                    text: 'text-warning',
                    hover: 'hover:border-warning/50'
                };
            default:
                return {
                    background: 'bg-primary/10',
                    border: 'border-primary/20',
                    text: 'text-primary',
                    hover: 'hover:border-primary/50'
                };
        }
    };

    const colors = getPriorityColor(data.priority);

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
                className={`h-8 rounded-lg flex items-center px-3 cursor-pointer
                          transition-all duration-200 border
                          ${colors.background} ${colors.border} ${colors.hover}
                          hover:shadow-lg hover:shadow-black/5`}
                style={{ width: `${width}px` }}
            >
                <div className="flex items-center gap-2 min-w-0 w-full">
                    <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${colors.text}`} />
                    <span className="text-sm font-medium truncate text-primary-foreground/90">
                        {data.label}
                    </span>
                    {data.duration > 1 && (
                        <span className="text-xs text-muted flex-shrink-0">
                            {data.duration}d
                        </span>
                    )}
                </div>

                <div className="absolute left-0 top-full mt-2 bg-background-hover rounded-lg p-3 
                            opacity-0 group-hover:opacity-100 transition-opacity duration-200
                            pointer-events-none z-50 w-72 border border-border shadow-xl shadow-black/20">
                    <div className="flex items-center gap-2 mb-2">
                        <div className={`w-2 h-2 rounded-full ${colors.text}`} />
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