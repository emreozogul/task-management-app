import { Link } from 'react-router-dom';
import { useKanbanStore } from '@/stores/kanbanStore';
import { Button } from '@/components/ui/button';
import { ListTodo, Trash2, MoreVertical } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const BoardList = () => {
    const { boards, deleteBoard } = useKanbanStore();
    const activeBoards = boards.filter(board => board.status !== 'archived');

    const handleDeleteBoard = (e: React.MouseEvent, boardId: string) => {
        e.preventDefault();
        e.stopPropagation();
        deleteBoard(boardId);
    };

    return (
        <div className="p-6">
            <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
                {activeBoards.map((board) => (
                    <Link
                        key={board.id}
                        to={`/boards/${board.id}`}
                        className="p-4 bg-background-hover hover:bg-background-hover-dark rounded-lg transition-colors"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-primary-foreground truncate pr-2">{board.title}</h3>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild onClick={(e) => e.preventDefault()}>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-background-hover">
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="bg-background-secondary border-border">
                                    <DropdownMenuItem
                                        className="text-destructive hover:text-destructive/90 hover:bg-background-hover cursor-pointer"
                                        onClick={(e) => handleDeleteBoard(e, board.id)}
                                    >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Delete Board
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-muted">
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