import { ListTodo, CheckCircle2, Clock, AlertCircle, Calendar, ArrowUpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { CollapsibleCard } from "../ui/collapsible-card";
import { useTaskStore } from "@/stores/taskStore";
import { isWithinInterval, startOfToday, endOfToday, isAfter, isBefore, addDays } from "date-fns";
import { Progress } from "../ui/progress";
import { TaskPriority } from "@/types/task";

export const TasksStatistics = () => {
    const { getAllTasks } = useTaskStore();
    const tasks = getAllTasks();
    const today = new Date();
    const todayStart = startOfToday();
    const todayEnd = endOfToday();
    const nextWeek = addDays(today, 7);

    // Active (non-completed) tasks
    const activeTasks = tasks.filter(task => !task.completed);
    const totalActiveTasks = activeTasks.length;

    // Total Tasks
    const totalTasks = tasks.length;

    // Completed Tasks
    const completedTasks = tasks.filter(task => task.completed).length;
    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    // Today's Tasks (starting, ending, or spanning today)
    const todaysTasks = tasks.filter(task => {
        if (!task.startDate || !task.endDate || task.completed) return false;
        const startDate = new Date(task.startDate);
        const endDate = new Date(task.endDate);
        return isWithinInterval(today, { start: startDate, end: endDate });
    }).length;

    // Upcoming Tasks (starting within next 7 days)
    const upcomingTasks = tasks.filter(task => {
        if (!task.startDate || task.completed) return false;
        const startDate = new Date(task.startDate);
        return isAfter(startDate, todayEnd) && isBefore(startDate, nextWeek);
    }).length;

    // Overdue Tasks
    const overdueTasks = tasks.filter(task => {
        if (!task.endDate || task.completed) return false;
        const endDate = new Date(task.endDate);
        return isBefore(endDate, todayStart);
    }).length;

    // High Priority Tasks (active only)
    const highPriorityTasks = tasks.filter(task =>
        task.priority === TaskPriority.HIGH && !task.completed
    ).length;

    const statistics = [
        {
            title: "Total Tasks",
            value: totalTasks,
            subValue: `${completionRate.toFixed(0)}% completed`,
            icon: <ListTodo className="w-5 h-5 text-primary" />,
            color: "text-primary",
            progress: completionRate
        },
        {
            title: "Today's Tasks",
            value: todaysTasks,
            subValue: "active today",
            icon: <Calendar className="w-5 h-5 text-info" />,
            color: "text-info",
            progress: totalActiveTasks > 0 ? (todaysTasks / totalActiveTasks) * 100 : 0
        },
        {
            title: "Upcoming",
            value: upcomingTasks,
            subValue: "next 7 days",
            icon: <Clock className="w-5 h-5 text-warning" />,
            color: "text-warning",
            progress: totalActiveTasks > 0 ? (upcomingTasks / totalActiveTasks) * 100 : 0
        },
        {
            title: "Overdue",
            value: overdueTasks,
            subValue: "tasks delayed",
            icon: <AlertCircle className="w-5 h-5 text-destructive" />,
            color: "text-destructive",
            progress: totalActiveTasks > 0 ? (overdueTasks / totalActiveTasks) * 100 : 0
        },
        {
            title: "Completed",
            value: completedTasks,
            subValue: "tasks finished",
            icon: <CheckCircle2 className="w-5 h-5 text-success" />,
            color: "text-success",
            progress: completionRate
        },
        {
            title: "High Priority",
            value: highPriorityTasks,
            subValue: "urgent tasks",
            icon: <ArrowUpCircle className="w-5 h-5 text-high-priority" />,
            color: "text-high-priority",
            progress: totalActiveTasks > 0 ? (highPriorityTasks / totalActiveTasks) * 100 : 0
        }
    ];

    return (
        <CollapsibleCard
            title="Statistics"
            icon={<ListTodo className="w-6 h-6 text-primary mr-2" />}
            className="bg-background-secondary border-none shadow-lg"
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {statistics.map((stat) => (
                    <div
                        key={stat.title}
                        className="flex flex-col p-4 bg-background-hover rounded-lg hover:bg-background-hover-dark transition-all"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-background rounded-lg">
                                    {stat.icon}
                                </div>
                                <div>
                                    <p className="text-muted text-sm">{stat.title}</p>
                                    <p className={cn("text-xl font-bold", stat.color)}>
                                        {stat.value}
                                    </p>
                                    <p className="text-xs text-muted">
                                        {stat.subValue}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <Progress
                            value={stat.progress}
                            className="h-1.5 bg-background"
                            indicatorClassName={cn(
                                stat.title === "Total Tasks" && "bg-primary",
                                stat.title === "Today's Tasks" && "bg-info",
                                stat.title === "Upcoming" && "bg-warning",
                                stat.title === "Overdue" && "bg-destructive",
                                stat.title === "Completed" && "bg-success",
                                stat.title === "High Priority" && "bg-high-priority"
                            )}
                        />
                    </div>
                ))}
            </div>
        </CollapsibleCard>
    );
};

