import { Sheet, SheetContent, SheetHeader } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDocumentStore } from "@/stores/documentStore";
import { useTaskStore } from "@/stores/taskStore";
import { useKanbanStore } from "@/stores/kanbanStore";
import { FileText, Trash } from "lucide-react";
import { useState, useEffect } from 'react';
import { TagManager } from "@/components/tasks/TagManager";
import DeadlineSelector from "./DeadlineSelector";
import { Task, TaskPriority } from "@/types/task";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DateRange } from "react-day-picker";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { DocumentPreview } from "./DocumentPreview";
import { useDialogKeyboard } from "@/hooks/useDialogKeyboard";

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

    const [isTagDialogOpen, setIsTagDialogOpen] = useState(false);
    const [newTag, setNewTag] = useState('');

    const [taskValues, setTaskValues] = useState(task);

    useEffect(() => {
        setTaskValues(task);
    }, [task]);

    const taskLocations = boards.reduce((acc, board) => {
        board.columns.forEach(column => {
            if (column.taskIds.includes(taskId)) {
                acc.push({ boardId: board.id, boardTitle: board.title, columnId: column.id, columnTitle: column.title });
            }
        });
        return acc;
    }, [] as { boardId: string; boardTitle: string; columnId: string; columnTitle: string }[]);

    const handleTaskUpdate = (field: keyof Task, value: any) => {
        const updatedValues = { ...taskValues, [field]: value };
        setTaskValues(updatedValues);
        updateTask(taskId, { [field]: value });
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleTaskUpdate('title', e.target.value.trim());
    };

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        handleTaskUpdate('description', e.target.value);
    };

    const handleCompletedChange = (checked: boolean) => {
        handleTaskUpdate('completed', checked);
    };

    const handlePriorityChange = (value: string) => {
        if (Object.values(TaskPriority).includes(value as TaskPriority)) {
            handleTaskUpdate('priority', value as TaskPriority);
        }
    };

    const handleDateRangeChange = (range: DateRange | null) => {
        if (range?.from && range?.to) {
            const startDate = new Date(range.from);
            const endDate = new Date(range.to);
            endDate.setHours(23, 59, 59, 999);

            const dateUpdates = {
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString()
            };

            setTaskValues(prev => ({ ...prev, ...dateUpdates }));
            updateTask(taskId, dateUpdates);
        }
    };

    const handleDocumentChange = (documentId: string) => {
        handleTaskUpdate('documentId', documentId);
    };

    const handleAddTag = () => {

        const currentLabels = taskValues.labels || [];
        handleTaskUpdate('labels', [...currentLabels, newTag.trim()]);
        setNewTag('');
        setIsTagDialogOpen(false);
    };

    const handleRemoveTag = (tag: string) => {
        const currentLabels = taskValues.labels || [];
        handleTaskUpdate('labels', currentLabels.filter(t => t !== tag));
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

    const handleTagDialogSubmit = () => {
        if (newTag.trim()) {
            handleAddTag();
        }
    };

    useDialogKeyboard({
        isOpen: isTagDialogOpen,
        onClose: () => {
            setIsTagDialogOpen(false);
            setNewTag('');
        },
        onSubmit: handleTagDialogSubmit
    });

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="bg-background-secondary border-l border-border sm:max-w-[500px] text-primary-foreground overflow-y-auto">
                <SheetHeader className="space-y-4">
                    <div className="flex items-center gap-3">
                        <Checkbox
                            checked={taskValues.completed}
                            onCheckedChange={handleCompletedChange}
                            className="border-primary w-5 h-5 data-[state=checked]:bg-primary"
                        />
                        <Input
                            value={taskValues.title}
                            onChange={handleTitleChange}
                            className={cn(
                                "flex-1 bg-background-hover border-none text-primary-foreground focus:ring-1 focus:ring-primary",
                                taskValues.completed && "line-through opacity-60"
                            )}
                        />
                    </div>

                    <div className="space-y-4 mt-4">
                        <div>
                            <Label className="text-muted">Description</Label>
                            <Textarea
                                value={taskValues.description}
                                onChange={handleDescriptionChange}
                                className="min-h-[100px] bg-background-hover border-none text-primary-foreground focus:ring-1 focus:ring-primary"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium mb-1 block">Date Range</label>
                            <DeadlineSelector
                                dateRange={taskValues.startDate && taskValues.endDate ? { from: new Date(taskValues.startDate), to: new Date(taskValues.endDate) } : null}
                                onDateRangeChange={handleDateRangeChange}
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium mb-1 block text-primary-foreground">Priority</label>
                            <Select
                                value={taskValues.priority}
                                onValueChange={handlePriorityChange}
                            >
                                <SelectTrigger className="bg-background-hover border-border text-primary-foreground">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-background-secondary border-border">
                                    <SelectItem
                                        value={TaskPriority.LOW}
                                        className="text-primary-foreground hover:bg-background-hover"
                                    >
                                        Low
                                    </SelectItem>
                                    <SelectItem
                                        value={TaskPriority.MEDIUM}
                                        className="text-primary-foreground hover:bg-background-hover"
                                    >
                                        Medium
                                    </SelectItem>
                                    <SelectItem
                                        value={TaskPriority.HIGH}
                                        className="text-primary-foreground hover:bg-background-hover"
                                    >
                                        High
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <label className="text-sm font-medium mb-1 block text-primary-foreground">Linked Document</label>
                            <Select value={taskValues.documentId || ''} onValueChange={handleDocumentChange}>
                                <SelectTrigger className="bg-background-hover border-border text-primary-foreground">
                                    <SelectValue placeholder="Select a document" />
                                </SelectTrigger>
                                <SelectContent className="bg-background-secondary border-border">
                                    {documents.map(doc => (
                                        <SelectItem
                                            key={doc.id}
                                            value={doc.id}
                                            className="text-primary-foreground hover:bg-background-hover"
                                        >
                                            <div className="flex items-center">
                                                <FileText className="w-4 h-4 mr-2 text-primary" />
                                                {doc.title}
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {taskValues.documentId && <DocumentPreview documentId={taskValues.documentId} />}
                        {taskLocations.length > 0 && (
                            <div>
                                <label className="text-sm font-medium mb-1 block">Board Locations</label>
                                <div className="space-y-2">
                                    {taskLocations.map(({ boardId, boardTitle, columnTitle }) => (
                                        <div
                                            key={`${boardId}-${columnTitle}`}
                                            className="flex items-center justify-between p-2 bg-background-hover rounded-lg"
                                        >
                                            <span className="text-sm text-primary-foreground">{boardTitle}</span>
                                            <span className="text-xs text-muted">{columnTitle}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="text-sm font-medium mb-1 block">Tags</label>
                            <div className="space-y-2">
                                <TagManager
                                    tags={taskValues.labels}
                                    onAddTag={() => setIsTagDialogOpen(true)}
                                    onRemoveTag={handleRemoveTag}
                                />
                            </div>

                            <Dialog open={isTagDialogOpen} onOpenChange={setIsTagDialogOpen}>
                                <DialogContent className="bg-background-secondary border-border">
                                    <DialogHeader>
                                        <DialogTitle>Add New Tag</DialogTitle>
                                    </DialogHeader>
                                    <div className="py-4">
                                        <Input
                                            value={newTag}
                                            onChange={(e) => setNewTag(e.target.value)}
                                            placeholder="Enter tag name"
                                            className="bg-background-hover border-border text-primary-foreground"
                                        />
                                    </div>
                                    <DialogFooter>
                                        <Button
                                            variant="ghost"
                                            onClick={() => {
                                                setIsTagDialogOpen(false);
                                                setNewTag('');
                                            }}
                                            className="border-border text-primary-foreground hover:bg-background-hover"
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            onClick={handleAddTag}
                                            className="bg-primary hover:bg-primary-hover text-primary-foreground"
                                            disabled={!newTag.trim()}
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
                </SheetHeader>
            </SheetContent>
        </Sheet>
    );
}; 