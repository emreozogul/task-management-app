import { useKanbanStore } from '@/stores/kanbanStore';
import { useDocumentStore } from '@/stores/documentStore';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Activity, FileText, Trello } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export const RecentActivity = () => {
    const { boards } = useKanbanStore();
    const { documents } = useDocumentStore();

    const activities = [
        ...boards.map(board => ({
            type: 'board',
            title: board.title,
            date: new Date(board.updatedAt),
            icon: <Trello className="w-4 h-4" />,
        })),
        ...documents.map(doc => ({
            type: 'document',
            title: doc.title,
            date: new Date(doc.updatedAt),
            icon: <FileText className="w-4 h-4" />,
        })),
    ].sort((a, b) => b.date.getTime() - a.date.getTime())
        .slice(0, 5);

    return (
        <Card className="bg-[#232430] p-6">
            <div className="flex items-center mb-4">
                <Activity className="w-5 h-5 mr-2 text-[#6775bc]" />
                <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
            </div>

            <ScrollArea className="h-[200px]">
                {activities.map((activity, index) => (
                    <div
                        key={index}
                        className="flex items-center justify-between py-2 border-b border-[#383844] last:border-0"
                    >
                        <div className="flex items-center">
                            <div className="text-[#6775bc] mr-2">
                                {activity.icon}
                            </div>
                            <div className="text-white">{activity.title}</div>
                        </div>
                        <div className="text-sm text-[#95959c]">
                            {formatDistanceToNow(activity.date, { addSuffix: true })}
                        </div>
                    </div>
                ))}
            </ScrollArea>
        </Card>
    );
}; 