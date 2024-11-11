import { FileText, Link as LinkIcon, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDocumentStore } from '@/stores/documentStore';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Task } from '@/types/kanban';

interface TaskCardProps {
    task: Task;
    onUpdate: (updates: Partial<Task>) => void;
}

export default function TaskCard({ task, onUpdate }: TaskCardProps) {
    const { documents } = useDocumentStore();
    const linkedDocument = documents.find(doc => doc.id === task.documentId);

    const handleCheckboxChange = (checked: boolean) => {
        onUpdate({ completed: checked === true });
    };

    return (
        <div className="bg-[#232430] p-3 rounded-lg shadow-sm">
            <div className="flex items-center gap-2 mb-2">
                <Checkbox
                    id={`task-${task.id}`}
                    checked={task.completed}
                    onCheckedChange={handleCheckboxChange}
                    className="border-[#6775bc]"
                />
                <h3 className={`text-white font-medium flex-1 ${task.completed ? 'line-through opacity-60' : ''}`}>
                    {task.title}
                </h3>
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                            <LinkIcon className="mr-2 h-4 w-4" />
                            Link Document
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {task.labels.length > 0 && (
                <div className="flex flex-wrap gap-1 my-2">
                    {task.labels.map(label => (
                        <Badge
                            key={label}
                            variant="secondary"
                            className="bg-[#383844] text-white text-xs"
                        >
                            {label}
                        </Badge>
                    ))}
                </div>
            )}

            {linkedDocument && (
                <div className="flex items-center text-sm text-[#6775bc] hover:text-[#7983c4] mt-2">
                    <FileText className="w-4 h-4 mr-1" />
                    {linkedDocument.title}
                </div>
            )}
        </div>
    );
} 