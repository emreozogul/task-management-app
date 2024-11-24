import { useState, useMemo } from 'react';
import { useTaskStore } from '@/stores/taskStore';
import { CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import {
    format,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    startOfWeek,
    endOfWeek,
} from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { CalendarCell } from '@/components/calendar/CalendarCell';
import { CalendarTask } from '@/components/calendar/CalendarTask';
import { Task, TaskPriority } from '@/types/task';
import { toast } from 'sonner';

export default function CalendarPage() {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const { tasks, updateTask, createTask } = useTaskStore();
    const [activeId, setActiveId] = useState<string | null>(null);
    const [activeTask, setActiveTask] = useState<Task | null>(null);

    const calendarDays = useMemo(() => {
        const start = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 1 });
        const end = endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 1 });
        return eachDayOfInterval({ start, end });
    }, [currentMonth]);

    const getTasksForDate = (date: Date) => {
        return tasks.filter(task => {
            if (!task.startDate) return false;
            const taskDate = new Date(task.startDate);
            return isSameDay(taskDate, date);
        });
    };

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        setActiveId(active.id as string);

        const draggedTask = tasks.find(task => task.id === active.id);
        setActiveTask(draggedTask || null);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveId(null);
        setActiveTask(null);

        if (!over || !tasks) return;

        const taskId = active.id as string;
        const newDate = new Date(over.id);
        const task = tasks.find(task => task.id === taskId);

        if (task) {
            const originalStart = task.startDate ? new Date(task.startDate) : new Date();
            const originalEnd = task.endDate ? new Date(task.endDate) : new Date();
            const duration = originalEnd.getTime() - originalStart.getTime();

            const newStartDate = new Date(newDate);
            newStartDate.setHours(0, 0, 0, 0);

            const newEndDate = new Date(newStartDate.getTime() + duration);
            newEndDate.setHours(23, 59, 59, 999);

            updateTask(taskId, {
                startDate: newStartDate.toISOString(),
                endDate: newEndDate.toISOString()
            });

            toast.success(`Task "${task.title}" moved to ${format(newDate, 'MMM dd')}`);
        }
    };

    const handleAddTask = (date: Date) => {
        const startDate = new Date(date);
        startDate.setHours(0, 0, 0, 0);

        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 7);
        endDate.setHours(23, 59, 59, 999);

        createTask({
            title: "New Task",
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            priority: TaskPriority.LOW,
        });
    };

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    return (
        <div className="p-6 h-full flex flex-col overflow-hidden">
            <Card className="p-4 mb-4 bg-background-secondary border-border">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center">
                        <CalendarIcon className="w-7 h-7 mr-3 text-primary" />
                        <h1 className="text-2xl md:text-3xl font-bold text-primary-foreground">
                            {format(currentMonth, 'MMMM yyyy')}
                        </h1>
                    </div>
                    <div className="flex gap-3 w-full sm:w-auto">
                        <Button
                            onClick={() => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1))}
                            className="flex-1 sm:flex-none bg-background-hover hover:bg-background-hover-dark border-none"
                            size="lg"
                        >
                            <ChevronLeft className="w-5 h-5 mr-2" />
                            Previous
                        </Button>
                        <Button
                            onClick={() => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1))}
                            className="flex-1 sm:flex-none bg-background-hover hover:bg-background-hover-dark border-none"
                            size="lg"
                        >
                            Next
                            <ChevronRight className="w-5 h-5 ml-2" />
                        </Button>
                    </div>
                </div>
            </Card>

            <Card className="flex-1 p-2 md:p-4 bg-background-secondary border-border overflow-hidden">
                <DndContext
                    sensors={sensors}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                >
                    <div className="h-full flex flex-col overflow-hidden">
                        {/* Calendar Header */}
                        <div className="grid grid-cols-7 mb-2">
                            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                                <div key={day} className="text-center text-sm font-medium text-primary py-2">
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Calendar Grid */}
                        <div className="flex-1 grid grid-cols-7 gap-2 pt-2 overflow-y-auto min-h-0">
                            {calendarDays.map((day) => (
                                <CalendarCell
                                    key={day.toISOString()}
                                    day={day}
                                    tasks={getTasksForDate(day)}
                                    isToday={isSameDay(day, new Date())}
                                    isCurrentMonth={isSameMonth(day, currentMonth)}
                                    onAddTask={handleAddTask}
                                />
                            ))}
                        </div>
                    </div>
                    <DragOverlay>
                        {activeId && activeTask ? (
                            <div className="opacity-80">
                                <CalendarTask
                                    task={activeTask}
                                />
                            </div>
                        ) : null}
                    </DragOverlay>
                </DndContext>
            </Card>
        </div>
    );
}
