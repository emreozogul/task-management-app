import { Calendar as CalendarIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CollapsibleCard } from '../ui/collapsible-card';
import { useTaskStore } from '@/stores/taskStore';
import { format, isToday, isWithinInterval } from 'date-fns';
import { Task } from '@/types/task';
import { cn } from '@/lib/utils';
export const TodaysTaskList = () => {
    const { getAllTasks } = useTaskStore();

    const getTodaysTasks = () => {
        const today = new Date();

        return getAllTasks().filter(task => {
            if (!task.startDate || !task.endDate) return false;
            const startDate = new Date(task.startDate);
            const endDate = new Date(task.endDate);

            // Include tasks that:
            // 1. Start today
            // 2. End today
            // 3. Span across today (started before and end after)
            return (
                isToday(startDate) || // Tasks starting today
                isToday(endDate) || // Tasks ending today
                isWithinInterval(today, { start: startDate, end: endDate }) // Tasks spanning today
            );
        }).sort((a, b) => {
            // Sort by start date
            const dateA = new Date(a.startDate!);
            const dateB = new Date(b.startDate!);
            return dateA.getTime() - dateB.getTime();
        });
    };

    const todaysTasks = getTodaysTasks();

    const getTaskStatus = (task: Task) => {
        const startDate = new Date(task.startDate!);
        const endDate = new Date(task.endDate!);

        if (isToday(startDate)) {
            return {
                label: "Starts today",
                className: "bg-status-starts-bg text-status-starts-text"
            };
        } else if (isToday(endDate)) {
            return {
                label: "Due today",
                className: "bg-status-due-bg text-status-due-text"
            };
        } else {
            return {
                label: "Active",
                className: "bg-status-active-bg text-status-active-text"
            };
        }
    };

    return (
        <CollapsibleCard
            title="Today's Tasks"
            icon={<CalendarIcon className="w-6 h-6 text-primary mr-2" />}
            className="bg-background-secondary border-none shadow-lg h-full"
        >
            {todaysTasks.length > 0 ? (
                <ScrollArea className="h-[300px] pr-4">
                    <div className="space-y-3">
                        {todaysTasks.map(task => {
                            const status = getTaskStatus(task);

                            return (
                                <div
                                    key={task.id}
                                    className="flex flex-col p-3 bg-background-hover hover:bg-background-hover-dark rounded-lg transition-all border border-transparent hover:border-primary"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center space-x-3">
                                            <Badge
                                                variant="secondary"
                                                className={cn("text-xs", {
                                                    "bg-destructive/20 text-destructive": task.priority === 'high',
                                                    "bg-warning/20 text-warning": task.priority === 'medium',
                                                    "bg-info/20 text-info": task.priority === 'low'
                                                })}
                                            >
                                                {task.priority}
                                            </Badge>
                                            <span className="text-primary-foreground font-medium">{task.title}</span>
                                        </div>
                                        <Badge className={status.className}>
                                            {status.label}
                                        </Badge>
                                    </div>

                                    <div className="flex items-center justify-between text-xs text-muted">
                                        <div className="flex items-center gap-2">
                                            <CalendarIcon className="w-3.5 h-3.5" />
                                            <span>
                                                {format(new Date(task.startDate!), 'MMM dd')} - {format(new Date(task.endDate!), 'MMM dd')}
                                            </span>
                                        </div>
                                        {task.completed && (
                                            <Badge variant="secondary" className="bg-background text-muted">
                                                Completed
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </ScrollArea>
            ) : (
                <div className="text-center py-6 bg-background-hover rounded-lg">
                    <CalendarIcon className="w-12 h-12 text-border mx-auto mb-3" />
                    <p className="text-muted">No tasks due today</p>
                </div>
            )}
        </CollapsibleCard>
    );
}; 