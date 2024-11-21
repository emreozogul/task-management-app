import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Board } from '../components/kanban/Board';
import { useKanbanStore } from '../stores/kanbanStore';
import { Button } from '@/components/ui/button';
import { Plus, MoreVertical, Trash2 } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const KanbanBoard = () => {
    const { boardId } = useParams();
    const navigate = useNavigate();
    const { boards, activeBoard, setActiveBoard, deleteBoard } = useKanbanStore();

    useEffect(() => {
        const board = boards.find(b => b.id === boardId);
        if (board) {
            setActiveBoard(board);
        } else {
            navigate('/boards/new');
        }
    }, [boardId, boards, setActiveBoard, navigate]);

    const handleDeleteBoard = () => {
        if (activeBoard) {
            deleteBoard(activeBoard.id);
            navigate('/boards');
        }
    };

    const boardMenu = (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-[#383844]">
                    <MoreVertical className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-[#232430] border-[#383844]">
                <DropdownMenuItem
                    className="text-red-500 hover:text-red-400 hover:bg-[#383844] cursor-pointer"
                    onClick={handleDeleteBoard}
                >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Board
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );

    if (!activeBoard) {
        return (
            <div className="p-6 text-center">
                <p className="text-[#95959c] mb-4">No board selected</p>
                <Button
                    onClick={() => navigate('/boards/new')}
                    className="bg-[#6775bc] hover:bg-[#7983c4] text-white"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Board
                </Button>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-white">
                    {activeBoard?.title}
                </h1>
                {boardMenu}
            </div>
            <Board />
        </div>
    );
};

export default KanbanBoard;