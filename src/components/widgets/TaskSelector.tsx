import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ListPlus, Search, CheckCircle2, X } from 'lucide-react';
import { usePomodoroStore } from '@/stores/pomodoroStore';
import { useTaskStore } from '@/stores/taskStore';
import { cn } from '@/lib/utils';

export const TaskSelector = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const { tasks } = useTaskStore();
    const { activeTaskId, setActiveTask, getTaskStatistics } = usePomodoroStore();

    const filteredTasks = tasks.filter(task =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleTaskSelect = (taskId: string) => {
        setActiveTask(taskId);
        setIsSearching(false);
        setSearchQuery('');
    };

    // Handle keyboard shortcuts
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.key === 't' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setIsSearching(true);
            } else if (e.key === 'Escape') {
                setIsSearching(false);
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, []);

    const activeTask = tasks.find(task => task.id === activeTaskId);
    const activeTaskStats = activeTaskId ? getTaskStatistics(activeTaskId) : null;

    return (
        <div className="relative h-full flex flex-col justify-start">
            {!isSearching ? (
                <Button
                    variant="outline"
                    className="w-full justify-start gap-2 h-16 py-3"
                    onClick={() => setIsSearching(true)}
                >
                    {activeTask ? (
                        <>
                            <CheckCircle2 className="w-4 h-4 text-primary" />
                            <div className="flex flex-col items-start text-left">
                                <span className="font-medium">{activeTask.title}</span>
                                {activeTaskStats && (
                                    <span className="text-xs text-muted-foreground">
                                        {activeTaskStats.completedSessions} sessions •
                                        {Math.floor(activeTaskStats.totalTime / 3600)}h
                                        {Math.floor((activeTaskStats.totalTime % 3600) / 60)}m
                                    </span>
                                )}
                            </div>
                        </>
                    ) : (
                        <>
                            <ListPlus className="w-4 h-4" />
                            <span>Select a task (⌘/Ctrl + T)</span>
                        </>
                    )}
                </Button>
            ) : (
                <div className=" inset-x-0  z-50 bg-background px-2 rounded-lg shadow-lg relative">
                    <div className="p-2">
                        <div className="flex items-center gap-2 mb-2">
                            <Search className="w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Search tasks..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="border-0 focus-visible:ring-0"
                                autoFocus
                            />
                        </div>
                        <div className="max-h-[200px] overflow-y-auto">
                            {filteredTasks.map(task => (
                                <Button
                                    key={task.id}
                                    variant="ghost"
                                    className={cn(
                                        "w-full justify-start gap-2 mb-1",
                                        task.id === activeTaskId && "bg-primary/10"
                                    )}
                                    onClick={() => handleTaskSelect(task.id)}
                                >
                                    <CheckCircle2 className={cn(
                                        "w-4 h-4",
                                        task.id === activeTaskId ? "text-primary" : "text-muted-foreground"
                                    )} />
                                    <span>{task.title}</span>
                                </Button>
                            ))}
                        </div>
                    </div>
                    <Button variant="outline" className="absolute -top-2 -right-3 flex items-center justify-center w-8 h-8 rounded-full bg-background" onClick={() => setIsSearching(false)}>
                        <X className="w-4 h-4" />
                    </Button>
                </div>
            )}
        </div>
    );
}; 