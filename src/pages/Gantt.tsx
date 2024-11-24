import { useMemo, useState } from 'react';
import { useTaskStore } from '@/stores/taskStore';
import {
    eachDayOfInterval,
    format,
    startOfToday,
    endOfMonth,
    addMonths,
    differenceInDays,
} from 'date-fns';
import { TaskNode } from '@/components/gantt/TaskNode';
import { TaskSheet } from '@/components/tasks/TaskSheet';
import { Task } from '@/types/task';

export default function GanttChart() {
    const { getAllTasks } = useTaskStore();
    const tasks = getAllTasks().filter(task => task.startDate && task.endDate);
    const [activeTask, setActiveTask] = useState<Task | null>(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    // Calculate date range to include all tasks and 3 months ahead
    const dateRange = useMemo(() => {
        if (tasks.length === 0) {
            const today = startOfToday();
            const endDate = endOfMonth(addMonths(today, 2));
            return eachDayOfInterval({ start: today, end: endDate });
        }

        // Find the earliest start date among all tasks
        const taskDates = tasks.flatMap(task => [
            new Date(task.startDate!),
            new Date(task.endDate!)
        ]);

        const earliestDate = new Date(Math.min(...taskDates.map(date => date.getTime())));
        const today = startOfToday();
        const endDate = endOfMonth(addMonths(today, 2));

        // Use the earlier of today or earliest task date as start
        const startDate = earliestDate < today ? earliestDate : today;

        return eachDayOfInterval({ start: startDate, end: endDate });
    }, [tasks]);

    const DAY_WIDTH = 100;

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const headerEl = document.getElementById('gantt-header');
        if (headerEl) {
            headerEl.scrollLeft = e.currentTarget.scrollLeft;
        }
    };

    if (tasks.length === 0) {
        return (
            <div className="p-6 h-screen bg-background flex items-center justify-center">
                <div className="text-muted text-center">
                    <p>No tasks with dates found.</p>
                    <p className="text-sm mt-2">Add tasks with start and end dates to view the timeline.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 h-[94vh]">
            <div className="h-full bg-background-secondary rounded-lg flex flex-col overflow-hidden">
                {/* Fixed header with dates */}
                <div
                    id="gantt-header"
                    className="bg-background-hover p-4 overflow-x-hidden"
                >
                    <div className="flex" style={{ width: dateRange.length * DAY_WIDTH }}>
                        {dateRange.map((date) => (
                            <div
                                key={date.toISOString()}
                                className="flex-shrink-0 text-center border-r border-border last:border-r-0"
                                style={{ width: `${DAY_WIDTH}px` }}
                            >
                                <div className="text-primary font-medium">
                                    {format(date, 'MMM dd')}
                                </div>
                                <div className="text-muted text-sm">
                                    {format(date, 'EEE')}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Task list and Gantt chart container */}
                <div className="flex flex-1 overflow-hidden">
                    {/* Gantt chart area - scrollable */}
                    <div
                        className="flex-1 overflow-x-auto relative p-4"
                        onScroll={handleScroll}
                    >
                        {/* Background grid */}
                        <div
                            className="absolute inset-0 grid"
                            style={{
                                gridTemplateColumns: `repeat(${dateRange.length}, ${DAY_WIDTH}px)`,
                                gridTemplateRows: `repeat(${tasks.length}, 50px)`,
                            }}
                        >
                            {dateRange.map((_, colIndex) => (
                                tasks.map((_, rowIndex) => (
                                    <div
                                        key={`${colIndex}-${rowIndex}`}
                                        className="border-r border-b border-border"
                                    />
                                ))
                            ))}
                        </div>

                        {/* Tasks */}
                        <div style={{ width: dateRange.length * DAY_WIDTH, height: tasks.length * 50 }}>
                            {tasks.map((task, index) => {
                                const startDate = new Date(task.startDate!);
                                const endDate = new Date(task.endDate!);
                                const firstDate = dateRange[0];
                                const startOffset = differenceInDays(startDate, firstDate);
                                const duration = differenceInDays(endDate, startDate) + 1;

                                return (
                                    <div
                                        key={task.id}
                                        className="absolute"
                                        style={{ top: `${index * 50}px` }}
                                        onClick={() => {
                                            setActiveTask(task);
                                            setIsSheetOpen(true);
                                        }}
                                    >
                                        <TaskNode
                                            data={{
                                                label: task.title,
                                                startOffset,
                                                duration,
                                                priority: task.priority,
                                                task,
                                                dayWidth: DAY_WIDTH,
                                            }}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {activeTask && (
                <TaskSheet
                    key={activeTask.id}
                    open={isSheetOpen}
                    onOpenChange={setIsSheetOpen}
                    taskId={activeTask.id}
                    task={activeTask}
                />
            )}
        </div>
    );
}