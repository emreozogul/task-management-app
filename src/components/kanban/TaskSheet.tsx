import { Sheet, SheetContent, SheetHeader } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDocumentStore } from "@/stores/documentStore";
import { KanbanTask, useKanbanStore } from "@/stores/kanbanStore";
import { FileText, Trash } from "lucide-react";
import { useState } from 'react';
import DatePickerWithRange from "./DeadlineSelector";
import { TagManager } from "@/components/TagManager";
import { Checkbox } from '@/components/ui/checkbox';

interface TaskSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    taskId: string;
    columnId: string;
    task: KanbanTask;
}

export const TaskSheet: React.FC<TaskSheetProps> = ({ open, onOpenChange, columnId, task }) => {
    const { documents } = useDocumentStore();
    const { updateTask, deleteTask } = useKanbanStore();
    const [title, setTitle] = useState(task.title);
    const [deadline, setDeadline] = useState(task.deadline ? new Date(task.deadline) : null);

    const handlePriorityChange = (value: string) => {
        updateTask(columnId, task.id, { priority: value as 'low' | 'medium' | 'high' });
    };

    const handleDocumentChange = (documentId: string) => {
        updateTask(columnId, task.id, { documentId });
    };

    const handleDelete = () => {
        deleteTask(columnId, task.id);
        onOpenChange(false);
    };

    const handleDeadlineChange = (date: Date | null) => {
        setDeadline(date);
        updateTask(columnId, task.id, { deadline: date ? date.toISOString() : undefined });
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
    };

    const handleTitleBlur = () => {
        if (title !== task.title) {
            updateTask(columnId, task.id, { title });
        }
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent>
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
                        <label className="text-sm font-medium mb-1 block">Deadline</label>
                        <DatePickerWithRange
                            deadline={deadline}
                            onDeadlineChange={handleDeadlineChange}
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium mb-1 block">Priority</label>
                        <Select value={task.priority} onValueChange={handlePriorityChange}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="low">Low</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="high">High</SelectItem>
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

                    <div>
                        <label className="text-sm font-medium mb-1 block">Tags</label>
                        <TagManager
                            tags={task.labels}
                            onAddTag={() => {
                                const dialog = window.prompt('Enter tag name:');
                                const newTag = dialog?.trim();
                                if (newTag) {
                                    const currentLabels = task.labels || [];
                                    if (!currentLabels.includes(newTag)) {
                                        updateTask(columnId, task.id, {
                                            labels: [...currentLabels, newTag]
                                        });
                                    }
                                }
                            }}
                            onRemoveTag={(tag) => {
                                const currentLabels = task.labels || [];
                                updateTask(columnId, task.id, {
                                    labels: currentLabels.filter(t => t !== tag)
                                });
                            }}
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium mb-1 block">Status</label>
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                checked={task.completed}
                                onCheckedChange={(checked) => {
                                    updateTask(columnId, task.id, { completed: checked as boolean });
                                }}
                            />
                            <span>Mark as completed</span>
                        </div>
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