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
                    background: 'bg-red-500/10',
                    border: 'border-red-500/20',
                    text: 'text-red-400',
                    hover: 'hover:border-red-500/50'
                };
            case 'medium':
                return {
                    background: 'bg-yellow-500/10',
                    border: 'border-yellow-500/20',
                    text: 'text-yellow-400',
                    hover: 'hover:border-yellow-500/50'
                };
            default:
                return {
                    background: 'bg-blue-500/10',
                    border: 'border-blue-500/20',
                    text: 'text-blue-400',
                    hover: 'hover:border-blue-500/50'
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
                    {/* Priority Dot */}
                    <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${colors.text}`} />

                    {/* Title */}
                    <span className={`text-sm font-medium truncate text-white/90`}>
                        {data.label}
                    </span>

                    {/* Optional: Show duration for longer tasks */}
                    {data.duration > 1 && (
                        <span className="text-xs text-white/50 flex-shrink-0">
                            {data.duration}d
                        </span>
                    )}
                </div>

                {/* Task details on hover */}
                <div className="absolute left-0 top-full mt-2 bg-[#2a2b38] rounded-lg p-3 
                            opacity-0 group-hover:opacity-100 transition-opacity duration-200
                            pointer-events-none z-50 w-72 border border-white/5 shadow-xl shadow-black/20">
                    <div className="flex items-center gap-2 mb-2">
                        <div className={`w-2 h-2 rounded-full ${colors.text}`} />
                        <h4 className="font-medium text-white">{data.task.title}</h4>
                    </div>

                    {data.task.description && (
                        <p className="text-white/60 text-sm mb-3 line-clamp-2">
                            {data.task.description}
                        </p>
                    )}

                    <div className="space-y-1.5 text-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-white/50">Duration</span>
                            <span className="text-white/80">{data.duration} days</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-white/50">Start</span>
                            <span className="text-white/80">
                                {format(new Date(data.task.startDate!), 'MMM dd, yyyy')}
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-white/50">End</span>
                            <span className="text-white/80">
                                {format(new Date(data.task.endDate!), 'MMM dd, yyyy')}
                            </span>
                        </div>

                        {data.task.labels?.length > 0 && (
                            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/5">
                                <span className="text-white/50">Tags:</span>
                                <div className="flex flex-wrap gap-1">
                                    {data.task.labels.map(label => (
                                        <span
                                            key={label}
                                            className="px-1.5 py-0.5 rounded-md text-xs bg-white/5 text-white/70"
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