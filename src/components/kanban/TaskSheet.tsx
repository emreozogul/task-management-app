import { Sheet, SheetContent, SheetHeader } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDocumentStore } from "@/stores/documentStore";
import { useTaskStore } from "@/stores/taskStore";
import { useKanbanStore } from "@/stores/kanbanStore";
import { FileText, Trash } from "lucide-react";
import { useState, useEffect, useCallback } from 'react';
import { TagManager } from "@/components/TagManager";
import DeadlineSelector from "./DeadlineSelector";
import { Task, TaskPriority } from "@/types/task";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DateRange } from "react-day-picker";

interface TaskSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    taskId: string;
    task: Task;
}

export const TaskSheet: React.FC<TaskSheetProps> = ({ open, onOpenChange, taskId, task }) => {
    const { documents } = useDocumentStore();
    const { updateTask, deleteTask } = useTaskStore();
    const { boards, removeTaskFromColumn } = useKanbanStore();

    const [title, setTitle] = useState(task.title);
    const [description, setDescription] = useState(task.description || '');
    const [dateRange, setDateRange] = useState<DateRange | null>(
        task.startDate && task.endDate
            ? {
                from: new Date(task.startDate),
                to: new Date(task.endDate),
            }
            : null
    );
    const [isTagDialogOpen, setIsTagDialogOpen] = useState(false);
    const [newTag, setNewTag] = useState('');

    // Find all boards and columns that contain this task
    const taskLocations = boards.reduce((acc, board) => {
        board.columns.forEach(column => {
            if (column.taskIds.includes(taskId)) {
                acc.push({ boardId: board.id, boardTitle: board.title, columnId: column.id, columnTitle: column.title });
            }
        });
        return acc;
    }, [] as { boardId: string; boardTitle: string; columnId: string; columnTitle: string }[]);

    useEffect(() => {
        if (task.startDate && task.endDate) {
            setDateRange({
                from: new Date(task.startDate),
                to: new Date(task.endDate),
            });
        } else {
            setDateRange(null);
        }
        if (task.title !== title) {
            setTitle(task.title);
        }
        if (task.description !== description) {
            setDescription(task.description || '');
        }
    }, [task]);

    const handlePriorityChange = (value: string) => {
        if (Object.values(TaskPriority).includes(value as TaskPriority)) {
            updateTask(taskId, { priority: value as TaskPriority });
        }
    };

    const handleDocumentChange = (documentId: string) => {
        updateTask(taskId, { documentId });
    };

    const handleDelete = () => {
        // Remove task from all boards/columns it exists in
        taskLocations.forEach(({ boardId, columnId }) => {
            removeTaskFromColumn(boardId, columnId, taskId);
        });
        // Delete the task itself
        deleteTask(taskId);
        onOpenChange(false);
    };

    const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
    }, []);

    const handleTitleBlur = useCallback(() => {
        if (title !== task.title) {
            updateTask(taskId, { title });
        }
    }, [taskId, title, task.title, updateTask]);

    const handleDescriptionBlur = useCallback(() => {
        if (description !== task.description) {
            updateTask(taskId, { description });
        }
    }, [taskId, description, task.description, updateTask]);

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="bg-[#232430] border-l-[#383844]">
                <SheetHeader>
                    <div className="flex justify-between items-center">
                        <input
                            type="text"
                            value={title}
                            className="text-lg font-bold w-full bg-transparent border-b border-gray-300 focus:outline-none"
                            placeholder="Task Title"
                            onChange={handleTitleChange}
                            onBlur={handleTitleBlur}
                        />
                    </div>
                </SheetHeader>

                <div className="space-y-4 mt-4">
                    <div>
                        <label className="text-sm font-medium mb-1 block text-white">Description</label>
                        <Textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            onBlur={handleDescriptionBlur}
                            placeholder="Add a description..."
                            className="bg-[#383844] border-[#4e4e59] text-white min-h-[100px]"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium mb-1 block">Date Range</label>
                        <DeadlineSelector
                            dateRange={dateRange}
                            onDateRangeChange={(range) => {
                                setDateRange(range);
                                if (range?.from && range?.to) {
                                    const startDate = new Date(range.from);
                                    const endDate = new Date(range.to);
                                    endDate.setHours(23, 59, 59, 999);

                                    updateTask(taskId, {
                                        ...task,
                                        startDate: startDate.toISOString(),
                                        endDate: endDate.toISOString(),
                                    });
                                }
                            }}
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium mb-1 block text-white">Priority</label>
                        <Select
                            value={task.priority}
                            onValueChange={handlePriorityChange}
                        >
                            <SelectTrigger className="bg-[#383844] border-[#4e4e59] text-white">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-[#232430] border-[#383844]">
                                <SelectItem
                                    value={TaskPriority.LOW}
                                    className="text-white hover:bg-[#383844]"
                                >
                                    Low
                                </SelectItem>
                                <SelectItem
                                    value={TaskPriority.MEDIUM}
                                    className="text-white hover:bg-[#383844]"
                                >
                                    Medium
                                </SelectItem>
                                <SelectItem
                                    value={TaskPriority.HIGH}
                                    className="text-white hover:bg-[#383844]"
                                >
                                    High
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <label className="text-sm font-medium mb-1 block">Linked Document</label>
                        <Select value={task.documentId || ''} onValueChange={handleDocumentChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a document" />
                            </SelectTrigger>
                            <SelectContent>
                                {documents.map(doc => (
                                    <SelectItem key={doc.id} value={doc.id}>
                                        <div className="flex items-center">
                                            <FileText className="w-4 h-4 mr-2" />
                                            {doc.title}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {taskLocations.length > 0 && (
                        <div>
                            <label className="text-sm font-medium mb-1 block">Board Locations</label>
                            <div className="space-y-2">
                                {taskLocations.map(({ boardId, boardTitle, columnTitle }) => (
                                    <div
                                        key={`${boardId}-${columnTitle}`}
                                        className="flex items-center justify-between p-2 bg-[#383844] rounded-lg"
                                    >
                                        <span className="text-sm text-white">{boardTitle}</span>
                                        <span className="text-xs text-[#95959c]">{columnTitle}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="text-sm font-medium mb-1 block">Tags</label>
                        <div className="space-y-2">
                            <TagManager
                                tags={task.labels}
                                onAddTag={() => setIsTagDialogOpen(true)}
                                onRemoveTag={(tag) => {
                                    const currentLabels = task.labels || [];
                                    updateTask(taskId, {
                                        labels: currentLabels.filter(t => t !== tag)
                                    });
                                }}
                            />
                        </div>

                        <Dialog open={isTagDialogOpen} onOpenChange={setIsTagDialogOpen}>
                            <DialogContent className="bg-[#232430] border-[#383844]">
                                <DialogHeader>
                                    <DialogTitle>Add New Tag</DialogTitle>
                                </DialogHeader>
                                <div className="py-4">
                                    <Input
                                        value={newTag}
                                        onChange={(e) => setNewTag(e.target.value)}
                                        placeholder="Enter tag name"
                                        className="bg-[#383844] border-[#4e4e59] text-white"
                                    />
                                </div>
                                <DialogFooter>
                                    <Button
                                        variant="ghost"
                                        onClick={() => {
                                            setIsTagDialogOpen(false);
                                            setNewTag('');
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            if (newTag.trim()) {
                                                const currentLabels = task.labels || [];
                                                if (!currentLabels.includes(newTag.trim())) {
                                                    updateTask(taskId, {
                                                        labels: [...currentLabels, newTag.trim()]
                                                    });
                                                }
                                                setIsTagDialogOpen(false);
                                                setNewTag('');
                                            }
                                        }}
                                    >
                                        Add Tag
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <Button
                        variant="destructive"
                        className="w-full mt-8"
                        onClick={handleDelete}
                    >
                        <Trash className="w-4 h-4 mr-2" />
                        Delete Task
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    );
}; 