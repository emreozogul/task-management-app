import { useDroppable } from '@dnd-kit/core';
import { format } from 'date-fns';
import { CalendarTask } from './CalendarTask';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Task } from '@/types/task';

interface CalendarCellProps {
    day: Date;
    tasks: Task[];
    isToday: boolean;
    isCurrentMonth: boolean;
    onAddTask: (date: Date) => void;
}

export const CalendarCell = ({
    day,
    tasks,
    isToday,
    isCurrentMonth,
    onAddTask,
}: CalendarCellProps) => {
    const { setNodeRef, isOver } = useDroppable({
        id: day.toISOString(),
    });

    const handleAddClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onAddTask(day);
    };

    return (
        <div
            ref={setNodeRef}
            className={`bg-[#1a1b23] rounded-lg p-2 flex flex-col h-[140px] w-full relative group
                        ${!isCurrentMonth ? 'opacity-40' : ''}
                        ${isToday ? 'ring-2 ring-[#6775bc] ring-inset' : ''}
                        ${isOver ? 'bg-[#2a2b38] transition-colors duration-200' : ''}
                    `}
        >
            <div className={`text-right text-sm font-medium mb-1 absolute top-0 right-0 rounded-full w-7 h-7 flex items-center justify-center -mr-1.5 border-2 -mt-1 flex-shrink-0 z-10
                        ${isToday ? 'text-[#6775bc] border-[#6775bc] bg-white text-[#6775bc]' : 'bg-[#2a2b38] text-white border-slate-800'}`}>
                {format(day, 'd')}
            </div>

            {/* Scrollable task container */}
            <div className="flex-1 overflow-y-auto min-h-0 space-y-1 scrollbar-thin scrollbar-thumb-[#383844] scrollbar-track-transparent pr-1 mt-6">
                {tasks.map(task => (
                    <CalendarTask
                        key={task.id}
                        task={task}
                    />
                ))}
            </div>

            {/* Add button */}
            <div className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleAddClick}
                    className="w-6 h-6 p-0 hover:bg-[#383844]"
                >
                    <Plus className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
};
