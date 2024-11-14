import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDocumentStore } from '@/stores/documentStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Documents = () => {
    const { documents, createDocument } = useDocumentStore();
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    const filteredDocuments = documents.filter((doc) => {
        const matchesSearch = doc.title
            .toLowerCase()
            .includes(search.toLowerCase());
        const matchesStatus =
            statusFilter === 'all' || doc.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleNewDocument = () => {
        const timestamp = Date.now().toString(16);
        const newDoc = createDocument(`Document - ${timestamp}`, 'general');
        navigate(`/documents/${newDoc.id}`, { replace: true });
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-bold text-white">Documents</h1>

                <Button className="bg-[#6775bc] hover:bg-[#7983c4] text-white w-full sm:w-auto"
                    onClick={handleNewDocument}
                >
                    <Plus className="w-4 h-4 mr-2" />
                    New Document
                </Button>

            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                <div className="w-full sm:w-64">
                    <Input
                        placeholder="Search documents..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="bg-[#383844] border-[#4e4e59] text-white w-full"
                    />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-40 bg-[#383844] border-[#4e4e59] text-white">
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#383844] border-[#4e4e59]">
                        <SelectItem value="all" className="text-white hover:bg-[#4e4e59]">All</SelectItem>
                        <SelectItem value="draft" className="text-white hover:bg-[#4e4e59]">Draft</SelectItem>
                        <SelectItem value="published" className="text-white hover:bg-[#4e4e59]">Published</SelectItem>
                        <SelectItem value="archived" className="text-white hover:bg-[#4e4e59]">Archived</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                {filteredDocuments.map((doc) => (
                    <Link
                        key={doc.id}
                        to={`/documents/${doc.id}`}
                        className="flex flex-col p-4 rounded-lg border border-[#383844] bg-[#232430] hover:bg-[#383844] transition-colors"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-white truncate pr-2">{doc.title}</h3>
                            <Badge
                                variant={
                                    doc.status === 'published'
                                        ? 'default'
                                        : doc.status === 'draft'
                                            ? 'secondary'
                                            : 'outline'
                                }
                                className={cn(
                                    'shrink-0',
                                    doc.status === 'published'
                                        ? 'bg-[#6775bc] text-white'
                                        : doc.status === 'draft'
                                            ? 'bg-[#383844] text-white'
                                            : 'border-[#383844] text-white'
                                )}
                            >
                                {doc.status}
                            </Badge>
                        </div>
                        <div className="text-sm text-[#95959c] mb-2">
                            {new Date(doc.updatedAt).toLocaleDateString()}
                        </div>
                        <div className="flex flex-wrap gap-1">
                            {doc.tags.map((tag) => (
                                <Badge key={tag} variant="outline" className="border-[#383844] text-[#95959c]">
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Documents; 