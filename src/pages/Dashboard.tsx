import { Link } from 'react-router-dom';
import { useKanbanStore } from '../stores/kanbanStore';
import { useDocumentStore } from '@/stores/documentStore';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, FileText, Trello } from 'lucide-react';
import { cn } from '@/lib/utils';

const Dashboard = () => {
    const { boards } = useKanbanStore();
    const { documents } = useDocumentStore();

    const recentDocuments = [...documents]
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, 5);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6 text-white">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Quick Actions */}
                <div className="bg-[#232430] p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4 text-white">Quick Actions</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <Link to="/documents/new">
                            <Button className="w-full bg-[#383844] hover:bg-[#4e4e59] text-white h-24 flex flex-col items-center justify-center space-y-2">
                                <FileText className="w-6 h-6" />
                                <span>New Document</span>
                            </Button>
                        </Link>
                        <Link to="/boards/new">
                            <Button className="w-full bg-[#383844] hover:bg-[#4e4e59] text-white h-24 flex flex-col items-center justify-center space-y-2">
                                <Trello className="w-6 h-6" />
                                <span>New Board</span>
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Recent Documents */}
                <div className="bg-[#232430] p-6 rounded-lg shadow">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-white">Recent Documents</h2>
                        <Link to="/documents" className="text-[#6775bc] hover:text-[#7983c4]">
                            View All
                        </Link>
                    </div>
                    <div className="space-y-2">
                        {recentDocuments.map((doc) => (
                            <Link
                                key={doc.id}
                                to={`/documents/${doc.id}`}
                                className="flex items-center justify-between p-3 bg-[#383844] hover:bg-[#4e4e59] rounded-lg transition-colors"
                            >
                                <div className="flex items-center space-x-3">
                                    <FileText className="w-4 h-4 text-[#95959c]" />
                                    <span className="text-white truncate ">{doc.title}</span>
                                </div>
                                <div className="w-1/4">
                                    <Badge
                                        variant={doc.status === 'published' ? 'default' : 'secondary'}
                                        className={cn(doc.status === 'published' ? 'bg-[#6775bc] text-white' : 'bg-[#383844] text-white', "w-full")}
                                    >
                                        {doc.status}
                                    </Badge>
                                </div>
                            </Link>
                        ))}
                        {recentDocuments.length === 0 && (
                            <p className="text-[#95959c] text-center py-4">No recent documents</p>
                        )}
                    </div>
                </div>

                {/* Active Boards */}
                <div className="bg-[#232430] p-6 rounded-lg shadow md:col-span-2">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-white">Active Boards</h2>
                        <Button variant="outline" className="border-[#383844] text-white hover:bg-[#383844]">
                            <Plus className="w-4 h-4 mr-2" />
                            New Board
                        </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {boards.map((board) => (
                            <Link
                                key={board.id}
                                to={`/boards/${board.id}`}
                                className="p-4 bg-[#383844] hover:bg-[#4e4e59] rounded-lg transition-colors"
                            >
                                <h3 className="font-semibold text-white mb-2">{board.title}</h3>
                                <p className="text-sm text-[#95959c]">
                                    {board.columns?.length || 0} columns
                                </p>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;