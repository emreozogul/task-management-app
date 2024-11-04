import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Board } from '../components/kanban/Board';
import { useKanbanStore } from '../stores/kanbanStore';

const KanbanBoard = () => {
    const { boardId } = useParams();
    const { boards, setActiveBoard } = useKanbanStore();

    useEffect(() => {
        const board = boards.find(b => b.id === boardId);
        if (board) {
            setActiveBoard(board);
        }
    }, [boardId, boards]);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Kanban Board</h1>
            <Board />
        </div>
    );
};

export default KanbanBoard;