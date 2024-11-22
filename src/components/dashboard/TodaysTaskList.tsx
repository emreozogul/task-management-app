import { Calendar as CalendarIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CollapsibleCard } from '../ui/collapsible-card';
import { useTaskStore } from '@/stores/taskStore';
import { format, isToday, isWithinInterval } from 'date-fns';
import { Task } from '@/types/task';
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
                className: "bg-[#6775bc] text-white"
            };
        } else if (isToday(endDate)) {
            return {
                label: "Due today",
                className: "bg-orange-500/20 text-orange-400"
            };
        } else {
            return {
                label: "Active",
                className: "bg-green-500/20 text-green-400"
            };
        }
    };

    return (
        <CollapsibleCard
            title="Today's Tasks"
            icon={<CalendarIcon className="w-6 h-6 text-[#6775bc] mr-2" />}
            className="bg-[#232430] border-none shadow-lg h-full"
        >
            {todaysTasks.length > 0 ? (
                <ScrollArea className="h-[300px] pr-4">
                    <div className="space-y-3">
                        {todaysTasks.map(task => {
                            const status = getTaskStatus(task);

                            return (
                                <div
                                    key={task.id}
                                    className="flex flex-col p-3 bg-[#383844] rounded-lg hover:bg-[#4e4e59] transition-all border border-transparent hover:border-[#6775bc]"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center space-x-3">
                                            <Badge
                                                variant={
                                                    task.priority === 'high' ? 'destructive' :
                                                        task.priority === 'medium' ? 'default' : 'secondary'
                                                }
                                                className="text-xs"
                                            >
                                                {task.priority}
                                            </Badge>
                                            <span className="text-white font-medium">{task.title}</span>
                                        </div>
                                        <Badge className={status.className}>
                                            {status.label}
                                        </Badge>
                                    </div>

                                    <div className="flex items-center justify-between text-xs text-[#95959c]">
                                        <div className="flex items-center gap-2">
                                            <CalendarIcon className="w-3.5 h-3.5" />
                                            <span>
                                                {format(new Date(task.startDate!), 'MMM dd')} - {format(new Date(task.endDate!), 'MMM dd')}
                                            </span>
                                        </div>
                                        {task.completed && (
                                            <Badge variant="secondary" className="bg-[#2a2b38] text-[#95959c]">
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
                <div className="text-center py-6 bg-[#383844] rounded-lg">
                    <CalendarIcon className="w-12 h-12 text-[#4e4e59] mx-auto mb-3" />
                    <p className="text-[#95959c]">No tasks due today</p>
                </div>
            )}
        </CollapsibleCard>
    );
}; 