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
            icon: <ListTodo className="w-5 h-5 text-[#6775bc]" />,
            color: "text-[#6775bc]",
            progress: completionRate
        },
        {
            title: "Today's Tasks",
            value: todaysTasks,
            subValue: "active today",
            icon: <Calendar className="w-5 h-5 text-blue-500" />,
            color: "text-blue-500",
            progress: totalActiveTasks > 0 ? (todaysTasks / totalActiveTasks) * 100 : 0
        },
        {
            title: "Upcoming",
            value: upcomingTasks,
            subValue: "next 7 days",
            icon: <Clock className="w-5 h-5 text-yellow-500" />,
            color: "text-yellow-500",
            progress: totalActiveTasks > 0 ? (upcomingTasks / totalActiveTasks) * 100 : 0
        },
        {
            title: "Overdue",
            value: overdueTasks,
            subValue: "tasks delayed",
            icon: <AlertCircle className="w-5 h-5 text-red-500" />,
            color: "text-red-500",
            progress: totalActiveTasks > 0 ? (overdueTasks / totalActiveTasks) * 100 : 0
        },
        {
            title: "Completed",
            value: completedTasks,
            subValue: "tasks finished",
            icon: <CheckCircle2 className="w-5 h-5 text-green-500" />,
            color: "text-green-500",
            progress: completionRate
        },
        {
            title: "High Priority",
            value: highPriorityTasks,
            subValue: "urgent tasks",
            icon: <ArrowUpCircle className="w-5 h-5 text-orange-500" />,
            color: "text-orange-500",
            progress: totalActiveTasks > 0 ? (highPriorityTasks / totalActiveTasks) * 100 : 0
        }
    ];

    return (
        <CollapsibleCard
            title="Statistics"
            icon={<ListTodo className="w-6 h-6 text-[#6775bc] mr-2" />}
            className="bg-[#232430] border-none shadow-lg"
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {statistics.map((stat) => (
                    <div
                        key={stat.title}
                        className="flex flex-col p-4 bg-[#383844] rounded-lg hover:bg-[#4e4e59] transition-all"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-[#2a2b38] rounded-lg">
                                    {stat.icon}
                                </div>
                                <div>
                                    <p className="text-[#95959c] text-sm">{stat.title}</p>
                                    <p className={cn("text-xl font-bold", stat.color)}>
                                        {stat.value}
                                    </p>
                                    <p className="text-xs text-[#95959c]">
                                        {stat.subValue}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <Progress
                            value={stat.progress}
                            className="h-1.5 bg-[#2a2b38]"
                            indicatorClassName={cn(
                                stat.title === "Total Tasks" && "bg-[#6775bc]",
                                stat.title === "Today's Tasks" && "bg-blue-500",
                                stat.title === "Upcoming" && "bg-yellow-500",
                                stat.title === "Overdue" && "bg-red-500",
                                stat.title === "Completed" && "bg-green-500",
                                stat.title === "High Priority" && "bg-orange-500"
                            )}
                        />
                    </div>
                ))}
            </div>
        </CollapsibleCard>
    );
};

