import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useKanbanStore } from '@/stores/kanbanStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const NewBoard = () => {
    const [title, setTitle] = useState('');
    const navigate = useNavigate();
    const { createBoard } = useKanbanStore();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (title.trim()) {
            const newBoard = createBoard(title.trim());
            navigate(`/boards/${newBoard.id}`);
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6 text-white">Create New Board</h1>
            <form onSubmit={handleSubmit} className="max-w-md space-y-4">
                <div>
                    <Input
                        type="text"
                        placeholder="Board Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="bg-[#383844] border-[#4e4e59] text-white"
                    />
                </div>
                <Button
                    type="submit"
                    className="bg-[#6775bc] hover:bg-[#7983c4] text-white"
                    disabled={!title.trim()}
                >
                    Create Board
                </Button>
            </form>
        </div>
    );
};

export default NewBoard; 