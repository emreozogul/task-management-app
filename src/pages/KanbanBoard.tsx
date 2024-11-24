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
            <div className="p-4 text-center">
                <p className="text-muted mb-4">No board selected</p>
                <Button
                    onClick={() => navigate('/boards/new')}
                    className="bg-primary hover:bg-primary-hover text-primary-foreground"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Board
                </Button>
            </div>
        );
    }

    return (
        <div className="p-4">
            <Board />
        </div>
    );
};

export default KanbanBoard;