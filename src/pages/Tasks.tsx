import { useState, useMemo } from 'react';
import { useTaskStore } from '@/stores/taskStore';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TaskSheet } from '@/components/tasks/TaskSheet';
import {
    Clock,
    AlertCircle,
    Calendar,
    Search,
    Tag as TagIcon,
    FileText,
    Filter,
    ArrowUpCircle,
    ArrowRightCircle,
    ArrowDownCircle,
    X,
    CheckCircle,
    SearchX
} from 'lucide-react';
import { format, isWithinInterval, startOfToday, endOfToday, isAfter, isBefore, addDays } from 'date-fns';
import { TaskPriority } from '@/types/task';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuCheckboxItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Task } from '@/types/task';
import { cn } from '@/lib/utils';

type TaskStatus = 'all' | 'in-progress' | 'upcoming' | 'overdue' | 'completed' | 'not-completed';

export default function TasksPage() {
    const { getAllTasks } = useTaskStore();
    const tasks = getAllTasks();

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStatus, setSelectedStatus] = useState<TaskStatus>('all');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [selectedPriorities, setSelectedPriorities] = useState<TaskPriority[]>([]);
    const [activeTask, setActiveTask] = useState<Task | null>(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    // Get all unique tags from tasks
    const allTags = useMemo(() => {
        const tagSet = new Set<string>();
        tasks.forEach(task => {
            task.labels?.forEach(tag => tagSet.add(tag));
        });
        return Array.from(tagSet);
    }, [tasks]);

    // Filter tasks based on search, status, tags, and priorities
    const filteredTasks = useMemo(() => {
        const today = new Date();
        const todayStart = startOfToday();
        const todayEnd = endOfToday();
        const nextWeek = addDays(today, 7);

        return tasks.filter(task => {
            // Search filter
            const searchLower = searchQuery.toLowerCase();
            const matchesSearch =
                task.title.toLowerCase().includes(searchLower) ||
                task.description?.toLowerCase().includes(searchLower) ||
                task.labels?.some(tag => tag.toLowerCase().includes(searchLower));

            if (!matchesSearch) return false;

            // Tags filter
            if (selectedTags.length > 0) {
                const hasSelectedTag = selectedTags.some(tag =>
                    task.labels?.includes(tag)
                );
                if (!hasSelectedTag) return false;
            }

            // Priority filter
            if (selectedPriorities.length > 0 && !selectedPriorities.includes(task.priority)) {
                return false;
            }

            // Status filter
            if (selectedStatus !== 'all') {
                const startDate = task.startDate ? new Date(task.startDate) : null;
                const endDate = task.endDate ? new Date(task.endDate) : null;

                switch (selectedStatus) {
                    case 'in-progress':
                        if (!startDate || !endDate) return false;
                        return isWithinInterval(today, { start: startDate, end: endDate });
                    case 'upcoming':
                        if (!startDate) return false;
                        return isAfter(startDate, todayEnd) && isBefore(startDate, nextWeek);
                    case 'overdue':
                        if (!endDate || task.completed) return false;
                        return isBefore(endDate, todayStart);
                    case 'completed':
                        return task.completed;
                    case 'not-completed':
                        return !task.completed;
                    default:
                        return true;
                }
            }

            return true;
        });
    }, [tasks, searchQuery, selectedStatus, selectedTags, selectedPriorities]);

    const handleTagClick = (tag: string) => {
        setSelectedTags(prev =>
            prev.includes(tag)
                ? prev.filter(t => t !== tag)
                : [...prev, tag]
        );
    };

    const handlePriorityToggle = (priority: TaskPriority) => {
        setSelectedPriorities(prev =>
            prev.includes(priority)
                ? prev.filter(p => p !== priority)
                : [...prev, priority]
        );
    };

    const clearFilters = () => {
        setSelectedStatus('all');
        setSelectedTags([]);
        setSelectedPriorities([]);
        setSearchQuery('');
    };

    const getPriorityIcon = (priority: TaskPriority) => {
        switch (priority) {
            case TaskPriority.HIGH:
                return <ArrowUpCircle className="w-4 h-4  " />;
            case TaskPriority.MEDIUM:
                return <ArrowRightCircle className="w-4 h-4 " />;
            case TaskPriority.LOW:
                return <ArrowDownCircle className="w-4 h-4 " />;
        }
    };

    const hasActiveFilters = selectedStatus !== 'all' ||
        selectedTags.length > 0 ||
        selectedPriorities.length > 0 ||
        searchQuery !== '';

    const getTaskStatus = (task: Task) => {
        if (task.completed) return 'Completed';

        const today = new Date();
        const startDate = task.startDate ? new Date(task.startDate) : null;
        const endDate = task.endDate ? new Date(task.endDate) : null;

        if (!startDate || !endDate) return null;

        if (isWithinInterval(today, { start: startDate, end: endDate })) {
            return 'In Progress';
        }

        if (isAfter(startDate, today)) {
            return 'Upcoming';
        }

        if (isBefore(endDate, today)) {
            return 'Overdue';
        }

        return null;
    };

    const getTaskStatusStyle = (task: Task): React.CSSProperties => {
        const status = getTaskStatus(task);
        switch (status) {
            case 'In Progress':
                return { color: 'var(--primary)' };
            case 'Upcoming':
                return { color: 'var(--muted)' };
            case 'Overdue':
                return { color: 'var(--destructive)' };
            default:
                return {};
        }
    };

    return (
        <div className="p-6 min-h-screen">
            <div className="max-w-7xl mx-auto space-y-6 relative">
                {/* Search and Filters */}
                <div className="bg-background-secondary rounded-lg p-4 sticky top-0 z-10">
                    <div className="flex flex-col gap-4">
                        {/* Search */}
                        <div className="relative w-1/2 flex-shrink-0">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary w-5 h-5" />
                            <Input
                                placeholder="Search tasks by title, description, or tags..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 bg-background-hover border-border text-primary-foreground w-full"
                            />
                        </div>

                        {/* Filters Container */}
                        <div className="flex flex-wrap items-center gap-2">
                            {/* Status filters */}
                            <Button
                                variant={selectedStatus === 'all' ? 'default' : 'outline'}
                                onClick={() => setSelectedStatus('all')}
                                className={cn(
                                    "h-9",
                                    selectedStatus === 'all' ? 'bg-primary' : 'border-border'
                                )}
                            >
                                All
                            </Button>
                            <Button
                                variant={selectedStatus === 'in-progress' ? 'default' : 'outline'}
                                onClick={() => setSelectedStatus('in-progress')}
                                className={cn(
                                    "h-9",
                                    selectedStatus === 'in-progress' ? 'bg-primary' : 'border-border'
                                )}
                            >
                                <Calendar className="w-4 h-4 mr-2" />
                                In Progress
                            </Button>
                            <Button
                                variant={selectedStatus === 'upcoming' ? 'default' : 'outline'}
                                onClick={() => setSelectedStatus('upcoming')}
                                className={cn(
                                    "h-9",
                                    selectedStatus === 'upcoming' ? 'bg-primary' : 'border-border'
                                )}
                            >
                                <Clock className="w-4 h-4 mr-2" />
                                Upcoming
                            </Button>
                            <Button
                                variant={selectedStatus === 'overdue' ? 'default' : 'outline'}
                                onClick={() => setSelectedStatus('overdue')}
                                className={cn(
                                    "h-9",
                                    selectedStatus === 'overdue' ? 'bg-primary' : 'border-border'
                                )}
                            >
                                <AlertCircle className="w-4 h-4 mr-2" />
                                Overdue
                            </Button>
                            <Button
                                variant={selectedStatus === 'completed' ? 'default' : 'outline'}
                                onClick={() => setSelectedStatus('completed')}
                                className={cn(
                                    "h-9",
                                    selectedStatus === 'completed' ? 'bg-primary' : 'border-border'
                                )}
                            >
                                Completed
                            </Button>
                            <Button
                                variant={selectedStatus === 'not-completed' ? 'default' : 'outline'}
                                onClick={() => setSelectedStatus('not-completed')}
                                className={cn(
                                    "h-9",
                                    selectedStatus === 'not-completed' ? 'bg-primary' : 'border-border'
                                )}
                            >
                                Not Completed
                            </Button>

                            {/* Priority Filter */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="h-9 border-border">
                                        <Filter className="w-4 h-4 mr-2" />
                                        Priority
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="bg-background-secondary border-border">
                                    {Object.values(TaskPriority).map((priority) => (
                                        <DropdownMenuCheckboxItem
                                            key={priority}
                                            checked={selectedPriorities.includes(priority)}
                                            onCheckedChange={() => handlePriorityToggle(priority)}
                                            className="text-primary-foreground hover:bg-background-hover"
                                        >
                                            <div className="flex items-center">
                                                {getPriorityIcon(priority)}
                                                <span className="ml-2 capitalize">{priority}</span>
                                            </div>
                                        </DropdownMenuCheckboxItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>

                            {/* Tags Filter */}
                            {allTags.length > 0 && (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" className="h-9 border-border">
                                            <TagIcon className="w-4 h-4 mr-2" />
                                            Tags
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="bg-background-secondary border-border">
                                        {allTags.map((tag) => (
                                            <DropdownMenuCheckboxItem
                                                key={tag}
                                                checked={selectedTags.includes(tag)}
                                                onCheckedChange={() => handleTagClick(tag)}
                                                className="text-primary-foreground hover:bg-background-hover"
                                            >
                                                {tag}
                                            </DropdownMenuCheckboxItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )}

                            {/* Clear Filters */}
                            {hasActiveFilters && (
                                <Button
                                    variant="ghost"
                                    onClick={clearFilters}
                                    className="h-9 text-muted hover:text-primary-foreground"
                                >
                                    <X className="w-4 h-4 mr-2" />
                                    Clear
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Active Filters Display */}
                    {hasActiveFilters && (
                        <div className="flex flex-wrap gap-2 items-center mt-4">
                            {selectedStatus !== 'all' && (
                                <Badge variant="default" className="bg-primary">
                                    Status: {selectedStatus}
                                </Badge>
                            )}
                            {selectedPriorities.map(priority => (
                                <Badge
                                    key={priority}
                                    variant="default"
                                    className={cn({
                                        'bg-destructive': priority === TaskPriority.HIGH,
                                        'bg-warning': priority === TaskPriority.MEDIUM,
                                        'bg-info': priority === TaskPriority.LOW,
                                    })}
                                >
                                    Priority: {priority}
                                </Badge>
                            ))}
                            {selectedTags.map(tag => (
                                <Badge key={tag} variant="default" className="bg-primary">
                                    Tag: {tag}
                                </Badge>
                            ))}
                        </div>
                    )}
                </div>

                {/* Tasks Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filteredTasks.map(task => (
                        <div
                            key={task.id}
                            onClick={() => {
                                setActiveTask(task);
                                setIsSheetOpen(true);
                            }}
                            className="bg-background-secondary rounded-lg hover:bg-background-hover transition-all cursor-pointer group border border-transparent hover:border-primary"
                        >
                            <div className="p-4">
                                {/* Header - Title and Priority */}
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-primary-foreground font-medium truncate flex-1 mr-2">{task.title}</h3>
                                    <Badge
                                        variant={task.priority === TaskPriority.HIGH ? 'destructive' : 'default'}
                                        className={cn({
                                            'bg-destructive': task.priority === TaskPriority.HIGH,
                                            'bg-warning': task.priority === TaskPriority.MEDIUM,
                                            'bg-info': task.priority === TaskPriority.LOW,
                                        })}
                                    >
                                        <div className="flex items-center gap-1">
                                            {getPriorityIcon(task.priority)}
                                            <span className="capitalize">{task.priority}</span>
                                        </div>
                                    </Badge>
                                </div>

                                {/* Description */}
                                {task.description && (
                                    <p className="text-muted text-sm mb-3 line-clamp-2">
                                        {task.description}
                                    </p>
                                )}

                                {/* Meta Information */}
                                <div className="flex flex-wrap items-center gap-3 text-sm text-muted mb-3">
                                    {task.startDate && task.endDate && (
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-4 h-4 text-primary" />
                                            <span>
                                                {format(new Date(task.startDate), 'MMM dd')} - {format(new Date(task.endDate), 'MMM dd')}
                                            </span>
                                        </div>
                                    )}
                                    {task.documentId && (
                                        <div className="flex items-center gap-1">
                                            <FileText className="w-4 h-4 text-primary" />
                                            <span>Linked Doc</span>
                                        </div>
                                    )}
                                </div>

                                {/* Tags */}
                                {task.labels && task.labels.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5">
                                        {task.labels.map(tag => (
                                            <Badge
                                                key={tag}
                                                variant="outline"
                                                className="border-border text-muted text-xs"
                                            >
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                )}

                                {/* Status Indicator */}
                                {task.completed ? (
                                    <div className="mt-3 flex items-center gap-1 text-success text-sm">
                                        <CheckCircle className="w-4 h-4" />
                                        <span>Completed</span>
                                    </div>
                                ) : getTaskStatus(task) && (
                                    <div className="mt-3 flex items-center gap-1 text-sm" style={getTaskStatusStyle(task)}>
                                        <Clock className="w-4 h-4" />
                                        <span>{getTaskStatus(task)}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {filteredTasks.length === 0 && (
                        <div className="flex flex-col items-center justify-center p-8 text-muted">
                            <SearchX className="w-12 h-12 mb-4" />
                            <h3 className="text-lg font-medium mb-2">No tasks found</h3>
                            <p className="text-sm text-center">
                                {searchQuery
                                    ? "No tasks match your search criteria"
                                    : "Try adjusting your filters or create a new task"}
                            </p>
                        </div>
                    )}
                </div>

                {/* Task Sheet */}
                {activeTask && (
                    <TaskSheet
                        key={activeTask.id}
                        open={isSheetOpen}
                        onOpenChange={setIsSheetOpen}
                        taskId={activeTask.id}
                        task={activeTask}
                    />
                )}
            </div>
        </div>
    );
}
