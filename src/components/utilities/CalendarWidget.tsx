import { useKanbanStore } from '@/stores/kanbanStore';
import { Card } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
export const CalendarWidget = () => {
    const { activeBoard } = useKanbanStore();

    const getDueTasks = (date: Date) => {
        return activeBoard?.columns
            .flatMap(col => col.tasks)
            .filter(task => {
                if (!task.deadline) return false;
                const taskDate = new Date(task.deadline);
                return (
                    taskDate.getDate() === date.getDate() &&
                    taskDate.getMonth() === date.getMonth() &&
                    taskDate.getFullYear() === date.getFullYear()
                );
            }) || [];
    };

    return (
        <Card className="bg-[#232430] p-6">
            <div className="flex items-center mb-4">
                <CalendarIcon className="w-5 h-5 mr-2 text-[#6775bc]" />
                <h2 className="text-lg font-semibold text-white">Calendar</h2>
            </div>

            <Calendar
                mode="single"
                modifiers={{
                    hasTasks: (date) => getDueTasks(date).length > 0,
                }}
                modifiersStyles={{
                    hasTasks: { backgroundColor: '#6775bc' },
                }}
                className="rounded-md border border-[#383844]"
            />

            <div className="mt-4">
                <h3 className="text-sm font-medium text-white mb-2">Today's Tasks</h3>
                <div className="space-y-2">
                    {getDueTasks(new Date()).map(task => (
                        <div key={task.id} className="flex items-center">
                            <Badge variant="secondary" className="mr-2">
                                {task.priority}
                            </Badge>
                            <span className="text-[#95959c]">{task.title}</span>
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    );
}; 