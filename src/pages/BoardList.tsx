import { Link } from 'react-router-dom';
import { useKanbanStore } from '@/stores/kanbanStore';
import { Button } from '@/components/ui/button';
import { Plus, FileText, ListTodo } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const BoardList = () => {
    const { boards } = useKanbanStore();
    const activeBoards = boards.filter(board => board.status !== 'archived');

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-white">Kanban Boards</h1>
                <Link to="/boards/new">
                    <Button className="bg-[#6775bc] hover:bg-[#7983c4] text-white">
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
                        <div className="flex items-center space-x-4 text-sm text-[#959c]">
                            <ListTodo className="w-4 h-4" />
                            <span>{board.columns?.length || 0} columns</span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default BoardList; 