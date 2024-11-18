import { useState, useMemo, useEffect } from 'react';
import { useKanbanStore } from '@/stores/kanbanStore';
import { CalendarIcon, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import { TaskSheet } from '@/components/kanban/TaskSheet';
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
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core';
import { CalendarCell } from '@/components/calendar/CalendarCell';
import { CalendarTask } from '@/components/calendar/CalendarTask';
import { Task, TaskPriority } from '@/types/task';

export default function CalendarPage() {
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const { activeBoard, updateTask, kanbanServices, addTask, initializeBoard } = useKanbanStore();
    const [activeId, setActiveId] = useState<string | null>(null);
    const [activeTask, setActiveTask] = useState<Task | null>(null);

    // Initialize board if needed
    useEffect(() => {
        if (!activeBoard) {
            initializeBoard();
        }
    }, [activeBoard, initializeBoard]);

    // Calculate calendar days including padding for complete weeks
    const calendarDays = useMemo(() => {
        const start = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 1 });
        const end = endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 1 });
        return eachDayOfInterval({ start, end });
    }, [currentMonth]);

    // Calculate number of weeks for grid template
    const numberOfWeeks = Math.ceil(calendarDays.length / 7);

    const getTasksForDate = (date: Date) => {
        if (!date || !activeBoard) return [];
        return activeBoard.columns
            .flatMap(col => col.tasks.map(task => ({
                ...task,
                columnId: col.id,
                columnTitle: col.title
            })))
            .filter(task => {
                if (!task.deadline) return false;
                const taskDate = new Date(task.deadline);
                return isSameDay(taskDate, date);
            });
    };

    const handleTaskClick = (task: Task) => {
        const column = activeBoard?.columns.find(col =>
            col.tasks.some(t => t.id === task.id)
        );

        if (column) {
            const completeTask = {
                ...task,
                columnId: column.id
            };

            setSelectedTask(completeTask);
            setIsSheetOpen(true);
        }
    };

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        setActiveId(active.id as string);

        // Find the task being dragged
        const draggedTask = activeBoard?.columns
            .flatMap(col => col.tasks)
            .find(task => task.id === active.id);

        setActiveTask(draggedTask || null);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        setActiveId(null);
        setActiveTask(null);
        const { active, over } = event;

        if (!over || !activeBoard) return;

        const taskId = active.id as string;
        const newDate = new Date(over.id);

        // Find the task and its column
        const column = activeBoard.columns.find(col =>
            col.tasks.some(task => task.id === taskId)
        );

        if (column && column.tasks) {
            const task = column.tasks.find(task => task.id === taskId);
            if (task) {
                // Only update the deadline, not the entire task
                updateTask(column.id, taskId, {
                    deadline: newDate.toISOString()
                });

                // Notify about the update
                kanbanServices.notification.notifyTaskUpdate(
                    { ...task, deadline: newDate.toISOString() },
                    'updated'
                );
            }
        }
    };

    const handleAddTask = (date: Date) => {
        if (!activeBoard?.columns[0]) return;

        const deadlineDate = new Date(date);
        deadlineDate.setHours(23, 59, 59, 999);

        const newTask = {
            id: crypto.randomUUID(),
            title: "New Task",
            deadline: deadlineDate.toISOString(),
            priority: TaskPriority.LOW,
            completed: false,
            labels: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            columnId: activeBoard.columns[0].id
        };

        addTask(activeBoard.columns[0].id, newTask);
    };

    return (
        <div className="p-4 h-full flex flex-col  overflow-hidden">
            <Card className="p-4  mb-4 bg-[#232430] border-none">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center">
                        <CalendarIcon className="w-7 h-7 mr-3 text-[#6775bc]" />
                        <h1 className="text-2xl md:text-3xl font-bold text-white">
                            {format(currentMonth, 'MMMM yyyy')}
                        </h1>
                    </div>
                    <div className="flex gap-3 w-full sm:w-auto">
                        <Button
                            onClick={() => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1))}
                            className="flex-1 sm:flex-none bg-[#383844] hover:bg-[#4e4e59] border-none"
                            size="lg"
                        >
                            <ChevronLeft className="w-5 h-5 mr-2" />
                            Previous
                        </Button>
                        <Button
                            onClick={() => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1))}
                            className="flex-1 sm:flex-none bg-[#383844] hover:bg-[#4e4e59] border-none"
                            size="lg"
                        >
                            Next
                            <ChevronRight className="w-5 h-5 ml-2" />
                        </Button>
                    </div>
                </div>
            </Card>

            <Card className="flex-1 p-2 md:p-4 bg-[#232430] border-none overflow-hidden">
                <DndContext
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                >
                    <div className="h-full flex flex-col overflow-hidden">
                        {/* Calendar Header */}
                        <div className="grid grid-cols-7 mb-2">
                            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                                <div key={day} className="text-center text-sm font-medium text-[#6775bc] py-2">
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Calendar Grid */}
                        <div className="flex-1 grid grid-cols-7 gap-2 overflow-y-auto min-h-0">
                            {calendarDays.map((day) => (
                                <CalendarCell
                                    key={day.toISOString()}
                                    day={day}
                                    tasks={getTasksForDate(day)}
                                    isToday={isSameDay(day, new Date())}
                                    isCurrentMonth={isSameMonth(day, currentMonth)}
                                    onTaskClick={handleTaskClick}
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
                                    onClick={() => { }}
                                />
                            </div>
                        ) : null}
                    </DragOverlay>
                </DndContext>
            </Card>

            {selectedTask && (
                <TaskSheet
                    open={isSheetOpen}
                    onOpenChange={setIsSheetOpen}
                    taskId={selectedTask.id}
                    columnId={selectedTask.columnId}
                    task={selectedTask}
                />
            )}
        </div>
    );
}
