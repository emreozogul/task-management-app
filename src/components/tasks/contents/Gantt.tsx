import { useMemo, useState } from 'react';
import { useTaskStore } from '@/stores/taskStore';
import {
    eachDayOfInterval,
    format,
    startOfToday,
    endOfMonth,
    addMonths,
    differenceInDays,
    eachWeekOfInterval,
    differenceInWeeks,
    startOfWeek,
    addDays,
} from 'date-fns';
import { TaskNode } from '@/components/gantt/TaskNode';
import { TaskSheet } from '@/components/tasks/TaskSheet';
import { Task } from '@/types/task';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function GanttChart() {
    const { getAllTasks } = useTaskStore();
    const tasks = getAllTasks().filter(task => task.startDate && task.endDate);
    const [activeTask, setActiveTask] = useState<Task | null>(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [typeOfListing, setTypeOfListing] = useState<'weekly' | 'daily'>('daily');

    // Calculate date range to include all tasks and 3 months ahead
    const dateRange = useMemo(() => {
        if (tasks.length === 0) {
            const today = startOfToday();
            const endDate = endOfMonth(addMonths(today, 2));
            return typeOfListing === 'weekly'
                ? eachWeekOfInterval({ start: today, end: endDate }, { weekStartsOn: 1 })
                : eachDayOfInterval({ start: today, end: endDate });
        }

        // Find the earliest start date and latest end date among all tasks
        const taskDates = tasks.flatMap(task => [
            new Date(task.startDate!),
            new Date(task.endDate!)
        ]);

        const earliestDate = new Date(Math.min(...taskDates.map(date => date.getTime())));
        const latestDate = new Date(Math.max(...taskDates.map(date => date.getTime())));
        const today = startOfToday();

        // Use the earlier of today or earliest task date as start
        const startDate = earliestDate < today ? earliestDate : today;

        // Use the later of latestDate or 2 months from today as end
        const twoMonthsFromToday = endOfMonth(addMonths(today, 2));
        const endDate = latestDate > twoMonthsFromToday ? latestDate : twoMonthsFromToday;

        return typeOfListing === 'weekly'
            ? eachWeekOfInterval({ start: startDate, end: endDate }, { weekStartsOn: 1 })
            : eachDayOfInterval({ start: startDate, end: endDate });
    }, [tasks, typeOfListing]);

    const getDateDisplay = (date: Date) => {
        if (typeOfListing === 'weekly') {
            const endOfWeek = addDays(date, 6);
            return {
                primary: `Week ${format(date, 'w')}`,
                secondary: `${format(date, 'MMM d')} - ${format(endOfWeek, 'MMM d')}`
            };
        }
        return {
            primary: format(date, 'MMM d'),
            secondary: format(date, 'EEE')
        };
    };

    const CELL_WIDTH = typeOfListing === 'weekly' ? 150 : 75;

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

    const handleTypeOfListing = (type: 'weekly' | 'daily') => {
        setTypeOfListing(type);
    }

    const getTaskPosition = (task: Task, firstDate: Date) => {
        const startDate = new Date(task.startDate!);
        const endDate = new Date(task.endDate!);

        if (typeOfListing === 'weekly') {
            const startWeek = startOfWeek(startDate, { weekStartsOn: 1 });
            const endWeek = startOfWeek(endDate, { weekStartsOn: 1 });
            const firstWeek = startOfWeek(firstDate, { weekStartsOn: 1 });

            const startOffset = differenceInWeeks(startWeek, firstWeek);
            const duration = differenceInWeeks(endWeek, startWeek) + 1;

            return { startOffset, duration };
        }

        const startOffset = differenceInDays(startDate, firstDate);
        const duration = differenceInDays(endDate, startDate) + 1;

        return { startOffset, duration };
    };

    return (
        <div className="mx-6 mb-2 mt-[72px]">
            <div className="h-full bg-background-secondary rounded-lg flex flex-col overflow-hidden">
                <div className="p-4 border-b border-border">
                    <div className="flex space-x-2">
                        <Button
                            variant={typeOfListing === 'daily' ? 'default' : 'outline'}
                            onClick={() => handleTypeOfListing('daily')}
                            size="sm"
                            className={cn(
                                "h-8",
                                typeOfListing === 'daily' ? 'bg-primary' : 'border-border'
                            )}
                        >
                            Daily
                        </Button>
                        <Button
                            variant={typeOfListing === 'weekly' ? 'default' : 'outline'}
                            onClick={() => handleTypeOfListing('weekly')}
                            size="sm"
                            className={cn(
                                "h-8",
                                typeOfListing === 'weekly' ? 'bg-primary' : 'border-border'
                            )}
                        >
                            Weekly
                        </Button>
                    </div>
                </div>

                <div className="flex-1 overflow-hidden">
                    <div className="overflow-x-auto" onScroll={handleScroll}>
                        <div style={{ width: dateRange.length * CELL_WIDTH }}>
                            <div
                                id="gantt-header"
                                className="bg-background-hover"
                            >
                                <div className="flex">
                                    {dateRange.map((date) => (
                                        <div
                                            key={date.toISOString()}
                                            className="flex-shrink-0 text-center py-1 border-b border-b-primary"
                                            style={{ width: `${CELL_WIDTH}px` }}
                                        >
                                            <div className="text-primary font-medium">
                                                {getDateDisplay(date).primary}
                                            </div>
                                            <div className="text-muted text-sm">
                                                {getDateDisplay(date).secondary}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="relative p-4">
                                <div
                                    className="absolute inset-0 grid"
                                    style={{
                                        gridTemplateColumns: `repeat(${dateRange.length}, ${CELL_WIDTH}px)`,
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

                                <div style={{ width: dateRange.length * CELL_WIDTH, height: tasks.length * 50 }}>
                                    {tasks.map((task, index) => {
                                        const { startOffset, duration } = getTaskPosition(task, dateRange[0]);

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
                                                        dayWidth: CELL_WIDTH,
                                                    }}
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
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