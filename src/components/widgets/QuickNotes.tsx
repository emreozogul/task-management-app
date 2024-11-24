import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { StickyNote, Save } from 'lucide-react';
import { CollapsibleCard } from '@/components/ui/collapsible-card';

export const QuickNotes = () => {
    const [note, setNote] = useState('');

    const handleSave = () => {
        localStorage.setItem('quick-note', note);
    };

    const saveButton = (
        <Button
            onClick={(e) => {
                e.stopPropagation();
                handleSave();
            }}
            variant="ghost"
            size="sm"
            className="text-primary hover:text-primary-hover"
        >
            <Save className="w-4 h-4" />
        </Button>
    );

    return (
        <CollapsibleCard title="Quick Notes" icon={<StickyNote className="w-5 h-5 mr-2 text-primary" />}>
            <Textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Type your quick notes here..."
                className="bg-background-hover border-border text-primary-foreground min-h-[200px]"
            />
        </CollapsibleCard>
    );
}; 