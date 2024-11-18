import { useKanbanStore } from '@/stores/kanbanStore';
import { Card } from '@/components/ui/card';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

export const CalendarWidget = () => {
    const { activeBoard } = useKanbanStore();

    const getTodaysTasks = () => {
        const today = new Date();
        return activeBoard?.columns
            .flatMap(col => col.tasks)
            .filter(task => {
                if (!task.deadline) return false;
                const taskDate = new Date(task.deadline);
                return (
                    taskDate.getDate() === today.getDate() &&
                    taskDate.getMonth() === today.getMonth() &&
                    taskDate.getFullYear() === today.getFullYear()
                );
            }) || [];
    };

    const todaysTasks = getTodaysTasks();

    return (
        <Card className="bg-[#232430] border-none shadow-lg">
            <div className="p-6">
                <div className="flex items-center mb-4">
                    <CalendarIcon className="w-5 h-5 mr-2 text-[#6775bc]" />
                    <h2 className="text-lg font-semibold text-white">Today's Tasks</h2>
                </div>

                {todaysTasks.length > 0 ? (
                    <div className="space-y-3">
                        {todaysTasks.map(task => (
                            <div
                                key={task.id}
                                className="flex items-center justify-between p-3 bg-[#383844] rounded-lg hover:bg-[#4e4e59] transition-all border border-transparent hover:border-[#6775bc]"
                            >
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
                                <span className="text-xs text-[#95959c]">
                                    {new Date(task.deadline || '').toLocaleDateString()}
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-6 bg-[#383844] rounded-lg">
                        <CalendarIcon className="w-12 h-12 text-[#4e4e59] mx-auto mb-3" />
                        <p className="text-[#95959c]">No tasks due today</p>
                    </div>
                )}
            </div>
        </Card>
    );
}; 