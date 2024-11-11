import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { StickyNote, Save } from 'lucide-react';

export const QuickNotes = () => {
    const [note, setNote] = useState('');

    const handleSave = () => {
        localStorage.setItem('quick-note', note);
    };

    return (
        <Card className="bg-[#232430] p-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                    <StickyNote className="w-5 h-5 mr-2 text-[#6775bc]" />
                    <h2 className="text-lg font-semibold text-white">Quick Notes</h2>
                </div>
                <Button
                    onClick={handleSave}
                    variant="ghost"
                    size="sm"
                    className="text-[#6775bc] hover:text-[#7983c4]"
                >
                    <Save className="w-4 h-4" />
                </Button>
            </div>

            <Textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Type your quick notes here..."
                className="bg-[#383844] border-[#4e4e59] text-white min-h-[150px]"
            />
        </Card>
    );
}; 