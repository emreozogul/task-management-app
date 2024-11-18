import { useDroppable } from '@dnd-kit/core';
import { format } from 'date-fns';
import { CalendarTask } from './CalendarTask';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from "@/components/ui/context-menu";

interface CalendarCellProps {
    day: Date;
    tasks: any[];
    isToday: boolean;
    isCurrentMonth: boolean;
    onTaskClick: (task: any) => void;
    onAddTask: (date: Date) => void;
}

export const CalendarCell = ({
    day,
    tasks,
    isToday,
    isCurrentMonth,
    onTaskClick,
    onAddTask
}: CalendarCellProps) => {
    const { setNodeRef, isOver } = useDroppable({
        id: day.toISOString(),
    });

    return (
        <ContextMenu>
            <ContextMenuTrigger>
                <div
                    ref={setNodeRef}
                    className={`bg-[#1a1b23] rounded-lg p-2 flex flex-col h-[140px] w-full relative group
                        ${!isCurrentMonth ? 'opacity-40' : ''}
                        ${isToday ? 'ring-2 ring-[#6775bc] ring-inset' : ''}
                        ${isOver ? 'bg-[#2a2b38] transition-colors duration-200' : ''}
                    `}
                >
                    <div className={`text-right text-sm font-medium mb-1 flex-shrink-0
                        ${isToday ? 'text-[#6775bc]' : 'text-white'}`}>
                        {format(day, 'd')}
                    </div>
                    <div className="flex-1 overflow-y-auto min-h-0 space-y-1 scrollbar-thin scrollbar-thumb-[#383844] scrollbar-track-transparent pr-1">
                        {tasks.map(task => (
                            <CalendarTask
                                key={task.id}
                                task={task}
                                onClick={onTaskClick}
                            />
                        ))}
                    </div>
                    <Button
                        size="sm"
                        variant="ghost"
                        className="absolute bottom-1 right-1 w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => onAddTask(day)}
                    >
                        <Plus className="w-4 h-4" />
                    </Button>
                </div>
            </ContextMenuTrigger>
            <ContextMenuContent>
                <ContextMenuItem onClick={() => onAddTask(day)}>
                    Add Task
                </ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    );
};
