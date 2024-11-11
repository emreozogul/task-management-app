import { Link } from 'react-router-dom';
import { useKanbanStore } from '@/stores/kanbanStore';
import { useDocumentStore } from '@/stores/documentStore';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, FileText, Trello, ListTodo } from 'lucide-react';
import { cn } from '@/lib/utils';

const Dashboard = () => {
    const { boards } = useKanbanStore();
    const { documents } = useDocumentStore();

    const recentDocuments = [...documents]
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, 5);

    const activeBoards = boards.filter(board => board.status !== 'archived');

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6 text-white">Dashboard</h1>

            {/* Quick Actions */}


            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Documents */}
                <div className="bg-[#232430] p-6 rounded-lg shadow mb-6 lg:col-span-1 h-full">
                    <h2 className="text-xl font-semibold mb-4 text-white">Quick Actions</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div className='col-span-2 xl:col-span-1'>
                            <Link to="/documents/new">
                                <Button className="w-full bg-[#383844] hover:bg-[#4e4e59] text-white h-24 flex flex-col items-center justify-center space-y-2">
                                    <FileText className="w-6 h-6" />
                                    <span>New Document</span>
                                </Button>
                            </Link>
                        </div>
                        <div className='col-span-2 xl:col-span-1'>
                            <Link to="/boards/new">
                                <Button className="w-full bg-[#383844] hover:bg-[#4e4e59] text-white h-24 flex flex-col items-center justify-center space-y-2">
                                    <Trello className="w-6 h-6" />
                                    <span>New Board</span>
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="bg-[#232430] p-6 rounded-lg shadow lg:col-span-2">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold text-white truncate max-w-xs">Recent Documents</h2>
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
                                <div className="flex items-center max-w-[70%] space-x-3">
                                    <FileText className="w-4 h-4 text-[#95959c] flex-shrink-0" />
                                    <span className="text-white truncate">{doc.title}</span>
                                </div>
                                <Badge
                                    variant={doc.status === 'published' ? 'default' : 'secondary'}
                                    className={cn(
                                        doc.status === 'published' ? 'bg-[#6775bc] text-white' : 'bg-[#383844] text-white',
                                        "overflow-hidden"
                                    )}
                                >
                                    {doc.status}
                                </Badge>
                            </Link>
                        ))}
                        {recentDocuments.length === 0 && (
                            <p className="text-[#95959c] text-center py-4">No recent documents</p>
                        )}
                    </div>
                </div>


                {/* Active Boards */}
                <div className="bg-[#232430] p-6 rounded-lg shadow lg:col-span-3">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-white">Active Boards</h2>
                        <Link to="/boards/new">
                            <Button variant="outline" className="border-[#383844] text-white hover:bg-[#383844]">
                                <Plus className="w-4 h-4 mr-2" />
                                New Board
                            </Button>
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {activeBoards.map((board) => (
                            <Link
                                key={board.id}
                                to={`/boards/${board.id}`}
                                className="p-4 bg-[#383844] hover:bg-[#4e4e59] rounded-lg transition-colors"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-semibold text-white truncate pr-2">{board.title}</h3>
                                    <Badge variant="outline" className="border-[#4e4e59] text-white">
                                        {board.columns?.length || 0} columns
                                    </Badge>
                                </div>
                                <div className="flex items-center space-x-4 text-sm text-[#95959c]">
                                    <div className="flex items-center">
                                        <ListTodo className="w-4 h-4 mr-1" />
                                        <span>{board.columns?.reduce((acc, col) => acc + (col.tasks?.length || 0), 0)} tasks</span>
                                    </div>
                                    <div className="flex items-center">
                                        <FileText className="w-4 h-4 mr-1" />
                                        <span>{board.columns?.reduce((acc, col) =>
                                            acc + (col.tasks?.filter(task => task.documentId)?.length || 0), 0
                                        )} docs</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                        {activeBoards.length === 0 && (
                            <p className="text-[#95959c] text-center py-4 col-span-full">No active boards</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;