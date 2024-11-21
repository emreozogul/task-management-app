import { Link } from 'react-router-dom';
import { Badge } from '../ui/badge';
import { FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDocumentStore } from '@/stores/documentStore';
import { CollapsibleCard } from '../ui/collapsible-card';

export const RecentDocuments = () => {
    const { documents } = useDocumentStore();

    const recentDocuments = [...documents]
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, 3);

    return (
        <CollapsibleCard title="Recent Documents" headerContent={
            <Link to="/documents" className="text-[#6775bc] hover:text-[#7983c4] text-sm font-medium">
                View All
            </Link>
        } icon={<FileText className="w-6 h-6 text-[#6775bc] mr-2" />} className="md:col-span-2 bg-[#232430] border-none shadow-lg">

            <div className="space-y-3">
                {recentDocuments.map((doc) => (
                    <Link
                        key={doc.id}
                        to={`/documents/${doc.id}`}
                        className="flex items-center justify-between p-4 bg-[#383844] hover:bg-[#4e4e59] rounded-lg transition-all group border border-transparent hover:border-[#6775bc]"
                    >
                        <div className="flex items-center max-w-[70%] space-x-4">
                            <FileText className="w-5 h-5 text-[#6775bc] group-hover:text-white transition-colors" />
                            <span className="text-white font-medium truncate">{doc.title}</span>
                        </div>
                        <Badge
                            variant={doc.status === 'published' ? 'default' : 'secondary'}
                            className={cn(
                                "text-sm font-medium transition-colors",
                                doc.status === 'published' ? 'bg-[#6775bc] text-white hover:bg-[#7983c4]' : 'bg-[#383844] text-[#95959c]'
                            )}
                        >
                            {doc.status}
                        </Badge>
                    </Link>
                ))}
            </div>

        </CollapsibleCard>
    );
};