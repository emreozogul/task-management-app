import { Link } from 'react-router-dom';
import { FileText } from 'lucide-react';
import { useDocumentStore } from '@/stores/documentStore';
import { CollapsibleCard } from '../ui/collapsible-card';

export const RecentDocuments = () => {
    const { documents } = useDocumentStore();

    const recentDocuments = [...documents]
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, 3);

    return (
        <CollapsibleCard title="Recent Documents" headerContent={
            <Link to="/documents" className="text-primary hover:text-primary-hover text-sm font-medium">
                View All
            </Link>
        } icon={<FileText className="w-6 h-6 text-primary mr-2" />} className="md:col-span-2 bg-background-secondary border-none shadow-lg">

            <div className="space-y-3">
                {recentDocuments.map((doc) => (
                    <Link
                        key={doc.id}
                        to={`/documents/${doc.id}`}
                        className="flex items-center justify-between p-4 bg-background-hover hover:bg-background-hover-dark rounded-lg transition-all group border border-transparent hover:border-primary"
                    >
                        <div className="flex items-center w-full space-x-4">
                            <FileText className="w-5 h-5 text-primary group-hover:text-primary-foreground transition-colors" />
                            <span className="text-primary-foreground font-medium truncate">{doc.title}</span>
                        </div>
                    </Link>
                ))}
            </div>

        </CollapsibleCard>
    );
};