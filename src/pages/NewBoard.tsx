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
            <Card className="p-6 bg-[#232430] border-none shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                    <LayoutGrid className="w-6 h-6 text-[#6775bc]" />
                    <h1 className="text-2xl font-bold text-white">Create New Board</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label className="text-white">Board Title</Label>
                        <Input
                            type="text"
                            placeholder="Enter board title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="bg-[#383844] border-[#4e4e59] text-white focus:ring-[#6775bc] focus:border-[#6775bc]"
                        />
                    </div>

                    <div className="space-y-4">
                        <Label className="text-white">Board Type</Label>
                        <RadioGroup value={boardType} onValueChange={setBoardType} className="space-y-4">
                            <Card className="bg-[#383844] border-[#4e4e59] hover:border-[#6775bc] transition-colors cursor-pointer">
                                <label className="p-4 flex items-center space-x-2 cursor-pointer">
                                    <RadioGroupItem value="default" id="default" className="border-[#6775bc] text-[#6775bc]" />
                                    <span className="text-white">Default Board (Todo, In Progress, Done)</span>
                                </label>
                            </Card>
                            <Card className="bg-[#383844] border-[#4e4e59] hover:border-[#6775bc] transition-colors cursor-pointer">
                                <label className="p-4 flex items-center space-x-2 cursor-pointer">
                                    <RadioGroupItem value="custom" id="custom" className="border-[#6775bc] text-[#6775bc]" />
                                    <span className="text-white">Custom Board</span>
                                </label>
                            </Card>
                        </RadioGroup>
                    </div>

                    {boardType === 'custom' && (
                        <div className="space-y-4">
                            <Label className="text-white">Custom Columns</Label>
                            <div className="space-y-3">
                                {customColumns.map((column, index) => (
                                    <div key={index} className="flex gap-2">
                                        <Input
                                            value={column}
                                            onChange={(e) => handleColumnChange(index, e.target.value)}
                                            placeholder={`Column ${index + 1}`}
                                            className="bg-[#383844] border-[#4e4e59] text-white focus:ring-[#6775bc] focus:border-[#6775bc]"
                                        />
                                        {customColumns.length > 1 && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                onClick={() => handleRemoveColumn(index)}
                                                className="text-red-500 hover:text-red-400 hover:bg-[#383844]"
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
                                    className="w-full border-dashed border-[#4e4e59] hover:bg-[#383844] text-[#6775bc] hover:text-white"
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Column
                                </Button>
                            </div>
                        </div>
                    )}

                    <Button
                        type="submit"
                        className="w-full bg-[#6775bc] hover:bg-[#7983c4] text-white"
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