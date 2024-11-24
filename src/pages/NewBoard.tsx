import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useKanbanStore } from '@/stores/kanbanStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card } from '@/components/ui/card';
import { Plus, X, LayoutGrid } from 'lucide-react';

const DEFAULT_COLUMNS = ['Todo', 'In Progress', 'Done'];

const NewBoard = () => {
    const [title, setTitle] = useState('');
    const [boardType, setBoardType] = useState('default');
    const [customColumns, setCustomColumns] = useState(['']);
    const navigate = useNavigate();
    const { createBoard } = useKanbanStore();

    const handleAddColumn = () => {
        setCustomColumns([...customColumns, '']);
    };

    const handleRemoveColumn = (index: number) => {
        if (customColumns.length > 1) {
            setCustomColumns(customColumns.filter((_, i) => i !== index));
        }
    };

    const handleColumnChange = (index: number, value: string) => {
        const newColumns = [...customColumns];
        newColumns[index] = value;
        setCustomColumns(newColumns);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (title.trim()) {
            const columns = boardType === 'default'
                ? DEFAULT_COLUMNS
                : customColumns.filter(col => col.trim());

            const newBoard = createBoard(title.trim(), columns);
            navigate(`/boards/${newBoard.id}`);
        }
    };

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <Card className="p-6 bg-background-secondary border-none shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                    <LayoutGrid className="w-6 h-6 text-primary" />
                    <h1 className="text-2xl font-bold text-primary-foreground">Create New Board</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label className="text-primary-foreground">Board Title</Label>
                        <Input
                            type="text"
                            placeholder="Enter board title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="bg-background-hover border-border text-primary-foreground focus:ring-primary focus:border-primary"
                        />
                    </div>

                    <div className="space-y-4">
                        <Label className="text-primary-foreground">Board Type</Label>
                        <RadioGroup value={boardType} onValueChange={setBoardType} className="space-y-4">
                            <Card className="bg-background-hover border-border hover:border-primary transition-colors cursor-pointer">
                                <label className="p-4 flex items-center space-x-2 cursor-pointer">
                                    <RadioGroupItem value="default" id="default" className="border-primary text-primary" />
                                    <span className="text-primary-foreground">Default Board (Todo, In Progress, Done)</span>
                                </label>
                            </Card>
                            <Card className="bg-background-hover border-border hover:border-primary transition-colors cursor-pointer">
                                <label className="p-4 flex items-center space-x-2 cursor-pointer">
                                    <RadioGroupItem value="custom" id="custom" className="border-primary text-primary" />
                                    <span className="text-primary-foreground">Custom Board</span>
                                </label>
                            </Card>
                        </RadioGroup>
                    </div>

                    {boardType === 'custom' && (
                        <div className="space-y-4">
                            <Label className="text-primary-foreground">Custom Columns</Label>
                            <div className="space-y-3">
                                {customColumns.map((column, index) => (
                                    <div key={index} className="flex gap-2">
                                        <Input
                                            value={column}
                                            onChange={(e) => handleColumnChange(index, e.target.value)}
                                            placeholder={`Column ${index + 1}`}
                                            className="bg-background-hover border-border text-primary-foreground focus:ring-primary focus:border-primary"
                                        />
                                        {customColumns.length > 1 && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                onClick={() => handleRemoveColumn(index)}
                                                className="text-destructive hover:text-destructive/90 hover:bg-background-hover"
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                ))}
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleAddColumn}
                                    className="w-full border-dashed border-border hover:bg-background-hover text-primary hover:text-primary-foreground"
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Column
                                </Button>
                            </div>
                        </div>
                    )}

                    <Button
                        type="submit"
                        className="w-full bg-primary hover:bg-primary-hover text-primary-foreground"
                        disabled={!title.trim() || (boardType === 'custom' && !customColumns.some(col => col.trim()))}
                    >
                        Create Board
                    </Button>
                </form>
            </Card>
        </div>
    );
};

export default NewBoard; 