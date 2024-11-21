import { useTaskStore } from '@/stores/taskStore';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { format } from 'date-fns';

interface TaskSelectorProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onTaskSelect: (taskId: string) => void;
    excludeTaskIds?: string[];
}

export const TaskSelector = ({
    open,
    onOpenChange,
    onTaskSelect,
    excludeTaskIds = []
}: TaskSelectorProps) => {
    const { getAllTasks } = useTaskStore();
    const [search, setSearch] = useState('');

    const tasks = getAllTasks().filter(
        task =>
            !excludeTaskIds.includes(task.id) &&
            task.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-[#232430] border-[#383844]">
                <DialogHeader>
                    <DialogTitle>Add Existing Task</DialogTitle>
                </DialogHeader>

                <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search tasks..."
                        className="pl-8 bg-[#383844] border-[#4e4e59] text-white"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <ScrollArea className="h-[300px] pr-4">
                    <div className="space-y-2">
                        {tasks.map((task) => (
                            <div
                                key={task.id}
                                onClick={() => {
                                    onTaskSelect(task.id);
                                    onOpenChange(false);
                                }}
                                className="flex flex-col p-3 rounded-lg hover:bg-[#383844] cursor-pointer"
                            >
                                <div className="font-medium text-white">{task.title}</div>
                                {task.startDate && task.endDate && (
                                    <div className="text-sm text-[#95959c]">
                                        Due: {format(new Date(task.startDate), 'MMM dd')} - {format(new Date(task.endDate), 'MMM dd')}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
};
