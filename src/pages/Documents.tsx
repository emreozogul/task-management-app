import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDocumentStore } from '@/stores/documentStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Search } from 'lucide-react';

const Documents = () => {
    const { documents } = useDocumentStore();
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

    return (
        <div className="container mx-auto p-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Documents</h1>
                <Link to="/documents/new">
                    <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        New Document
                    </Button>
                </Link>
            </div>

            <div className="flex gap-4 mb-6">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <Input
                        placeholder="Search documents..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10"
                    />
                </div>
                <Select
                    value={statusFilter}
                    onValueChange={setStatusFilter}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="draft">Drafts</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredDocuments.map((doc) => (
                    <Link
                        key={doc.id}
                        to={`/documents/${doc.id}`}
                        className="block p-4 rounded-lg border border-[#383844] bg-[#232430] hover:bg-[#383844] transition-colors"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-white">{doc.title}</h3>
                            <Badge
                                variant={
                                    doc.status === 'published'
                                        ? 'default'
                                        : doc.status === 'draft'
                                            ? 'secondary'
                                            : 'outline'
                                }
                                className={
                                    doc.status === 'published'
                                        ? 'bg-[#6775bc] text-white'
                                        : doc.status === 'draft'
                                            ? 'bg-[#383844] text-white'
                                            : 'border-[#383844] text-white'
                                }
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