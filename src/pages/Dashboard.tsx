import { Link } from 'react-router-dom';
import { useKanbanStore } from '@/stores/kanbanStore';
import { useDocumentStore } from '@/stores/documentStore';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, FileText, Trello, ListTodo, Activity, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CalendarWidget } from '@/components/utilities/CalendarWidget';
import { Card } from '@/components/ui/card';
import { RecentActivity } from '@/components/utilities/RecentActivity';
const Dashboard = () => {
    const { boards } = useKanbanStore();
    const { documents } = useDocumentStore();

    const recentDocuments = [...documents]
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, 5);

    const activeBoards = boards.filter(board => board.status !== 'archived');

    // Calculate statistics
    const totalTasks = activeBoards.reduce((acc, board) =>
        acc + board.columns.reduce((colAcc, col) => colAcc + col.tasks.length, 0), 0
    );

    const completedTasks = activeBoards.reduce((acc, board) =>
        acc + board.columns.reduce((colAcc, col) =>
            colAcc + col.tasks.filter(task => task.completed).length, 0), 0
    );

    const upcomingTasks = activeBoards.reduce((acc, board) =>
        acc + board.columns.reduce((colAcc, col) =>
            colAcc + col.tasks.filter(task => {
                if (!task.deadline) return false;
                const deadline = new Date(task.deadline);
                const today = new Date();
                return deadline > today && !task.completed;
            }).length, 0), 0
    );

    const statistics = [
        {
            title: "Total Tasks",
            value: totalTasks,
            icon: <ListTodo className="w-5 h-5 text-[#6775bc]" />,
            color: "text-[#6775bc]"
        },
        {
            title: "Completed",
            value: completedTasks,
            icon: <CheckCircle2 className="w-5 h-5 text-green-500" />,
            color: "text-green-500"
        },
        {
            title: "Upcoming",
            value: upcomingTasks,
            icon: <Clock className="w-5 h-5 text-yellow-500" />,
            color: "text-yellow-500"
        }
    ];

    return (
        <div className="p-6 min-h-screen bg-[#1a1b23]">

            <div className="grid grid-cols-12 gap-6">
                {/* Left Column */}
                <div className="col-span-12 xl:col-span-4 space-y-6">
                    {/* Quick Actions */}
                    <Card className="bg-[#232430] border-none shadow-lg">
                        <div className="p-6">
                            <h2 className="text-xl font-semibold mb-6 text-white">Quick Actions</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <Link to="/documents/new">
                                    <Button className="w-full bg-[#383844] hover:bg-[#4e4e59] text-white h-24 flex flex-col items-center justify-center space-y-3 border-2 border-[#4e4e59] hover:border-[#6775bc] transition-all">
                                        <FileText className="w-6 h-6" />
                                        <span>New Document</span>
                                    </Button>
                                </Link>
                                <Link to="/boards/new">
                                    <Button className="w-full bg-[#383844] hover:bg-[#4e4e59] text-white h-24 flex flex-col items-center justify-center space-y-3 border-2 border-[#4e4e59] hover:border-[#6775bc] transition-all">
                                        <Trello className="w-6 h-6" />
                                        <span>New Board</span>
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </Card>

                    {/* Recent Activity */}
                    <RecentActivity />
                </div>

                {/* Right Column */}
                <div className="col-span-12 xl:col-span-8 space-y-6">
                    {/* Today's Tasks */}
                    <CalendarWidget />

                    {/* Recent Documents */}
                    <Card className="bg-[#232430] border-none shadow-lg">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold text-white">Recent Documents</h2>
                                <Link to="/documents" className="text-[#6775bc] hover:text-[#7983c4] text-sm font-medium">
                                    View All
                                </Link>
                            </div>
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
                                {recentDocuments.length === 0 && (
                                    <div className="text-center py-8 bg-[#383844] rounded-lg">
                                        <FileText className="w-12 h-12 text-[#4e4e59] mx-auto mb-4" />
                                        <p className="text-[#95959c]">No recent documents</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Card>


                </div>
                {/* Active Boards */}
                <Card className="bg-[#232430] border-none shadow-lg col-span-12">
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-white">Active Boards</h2>
                            <Link to="/boards/new">
                                <Button className="bg-[#6775bc] hover:bg-[#7983c4] text-white">
                                    <Plus className="w-4 h-4 mr-2" />
                                    New Board
                                </Button>
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {activeBoards.map((board) => (
                                <Link
                                    key={board.id}
                                    to={`/boards/${board.id}`}
                                    className="p-5 bg-[#383844] hover:bg-[#4e4e59] rounded-lg transition-all group border border-transparent hover:border-[#6775bc]"
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="font-semibold text-white truncate pr-2">{board.title}</h3>
                                        <Badge className="bg-[#6775bc] text-white">
                                            {board.columns?.length || 0} columns
                                        </Badge>
                                    </div>
                                    <div className="flex items-center space-x-6 text-sm text-[#95959c]">
                                        <div className="flex items-center">
                                            <ListTodo className="w-4 h-4 mr-2 text-[#6775bc] group-hover:text-white transition-colors" />
                                            <span>{board.columns?.reduce((acc, col) => acc + (col.tasks?.length || 0), 0)} tasks</span>
                                        </div>
                                        <div className="flex items-center">
                                            <FileText className="w-4 h-4 mr-2 text-[#6775bc] group-hover:text-white transition-colors" />
                                            <span>{board.columns?.reduce((acc, col) =>
                                                acc + (col.tasks?.filter(task => task.documentId)?.length || 0), 0
                                            )} linked</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                            {activeBoards.length === 0 && (
                                <div className="text-center py-8 bg-[#383844] rounded-lg col-span-full">
                                    <Trello className="w-12 h-12 text-[#4e4e59] mx-auto mb-4" />
                                    <p className="text-[#95959c]">No active boards</p>
                                </div>
                            )}
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;