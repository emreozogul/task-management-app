import { useKanbanStore } from '@/stores/kanbanStore';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ListTodo } from 'lucide-react';
import { Plus } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import { CollapsibleCard } from '../ui/collapsible-card';

export const ActiveBoards = () => {
    const { boards } = useKanbanStore();

    const activeBoards = boards.filter(board => board.status !== 'archived');

    return (
        <CollapsibleCard title="Active Boards" headerContent={
            <Link to="/boards/new">
                <Button className="bg-primary hover:bg-primary-hover text-primary-foreground">
                    <Plus className="w-4 h-4 mr-2" />
                    New Board
                </Button>
            </Link>
        } icon={<ListTodo className="w-6 h-6 text-primary mr-2" />} className="md:col-span-2 bg-background-secondary border-none shadow-lg">

            <ScrollArea className="h-[300px] pr-5">
                <div className="space-y-3">
                    {activeBoards.map((board) => (
                        <Link
                            key={board.id}
                            to={`/boards/${board.id}`}
                            className="p-4 bg-background-hover hover:bg-background-hover-dark rounded-lg transition-all group border border-transparent hover:border-primary block"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="font-semibold text-primary-foreground truncate">{board.title}</h3>
                                <Badge className="bg-primary text-primary-foreground">
                                    {board.columns?.length || 0} columns
                                </Badge>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-muted">
                                <div className="flex items-center">
                                    <ListTodo className="w-4 h-4 mr-2 text-primary" />
                                    <span>{board.columns?.reduce((acc, col) => acc + (col.taskIds?.length || 0), 0)} tasks</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </ScrollArea>

        </CollapsibleCard>
    );
};
