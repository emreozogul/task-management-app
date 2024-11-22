import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Board } from '../components/kanban/Board';
import { useKanbanStore } from '../stores/kanbanStore';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';


const KanbanBoard = () => {
    const { boardId } = useParams();
    const navigate = useNavigate();
    const { boards, activeBoard, setActiveBoard } = useKanbanStore();

    useEffect(() => {
        const board = boards.find(b => b.id === boardId);
        if (board) {
            setActiveBoard(board);
        } else {
            navigate('/boards/new');
        }
    }, [boardId, boards, setActiveBoard, navigate]);


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

            <Board />
        </div>
    );
};

export default KanbanBoard;