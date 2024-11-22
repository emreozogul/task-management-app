import { Link } from 'react-router-dom';
import { useDocumentStore } from '@/stores/documentStore';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { useSearchStore } from '@/stores/searchStore';

const Documents = () => {
    const { documents } = useDocumentStore();
    const { query, setQuery } = useSearchStore();

    const filteredDocuments = documents.filter((doc) => {
        const matchesSearch = doc.title
            .toLowerCase()
            .includes(query.toLowerCase());

        return matchesSearch;
    });

    return (
        <div className="p-6 space-y-6">

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