import { FileText, Link, Link as LinkIcon, Trash, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDocumentStore } from '@/stores/documentStore';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Task } from '@/types/kanban';
interface TaskCardProps {
    task: Task;
    onUpdate: (task: Task) => void;
}

export default function TaskCard({ task }: TaskCardProps) {
    const { documents } = useDocumentStore();
    const linkedDocument = documents.find(doc => doc.id === task.documentId);

    const handleLinkDocument = () => {
        const availableDocs = documents.filter(doc => doc.status !== 'archived');
        // Show document selection dialog
        // For now, we'll use a simple dropdown
    };

    return (
        <div className="bg-[#232430] p-3 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-white font-medium">{task.title}</h3>
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={handleLinkDocument}>
                            <LinkIcon className="mr-2 h-4 w-4" />
                            Link Document
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            {linkedDocument && (
                <Link
                    to={`/documents/${linkedDocument.id}`}
                    className="flex items-center text-sm text-[#6775bc] hover:text-[#7983c4] mt-2"
                >
                    <FileText className="w-4 h-4 mr-1" />
                    {linkedDocument.title}
                </Link>
            )}
        </div>
    );
}; 