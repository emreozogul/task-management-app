import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { StickyNote, Save } from 'lucide-react';
import { CollapsibleCard } from '@/components/ui/collapsible-card';
import { useToast } from '@/hooks/use-toast';

export const QuickNotes = () => {
    const [note, setNote] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const { toast } = useToast();

    // Load saved note on component mount
    useEffect(() => {
        const savedNote = localStorage.getItem('quick-note');
        if (savedNote) {
            setNote(savedNote);
        }
    }, []);

    // Auto-save functionality with debounce
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (note) {
                localStorage.setItem('quick-note', note);
            }
        }, 1000); // 1 second debounce

        return () => clearTimeout(timeoutId);
    }, [note]);

    const handleSave = () => {
        try {
            setIsSaving(true);
            localStorage.setItem('quick-note', note);
            toast({
                title: "Note saved",
                description: "Your quick note has been saved successfully.",
                duration: 2000,
            });
        } catch (error) {
            toast({
                title: "Error saving note",
                description: "There was a problem saving your note.",
                variant: "destructive",
            });
        } finally {
            setIsSaving(false);
        }
    };

    const handleClear = () => {
        setNote('');
        localStorage.removeItem('quick-note');
        toast({
            title: "Note cleared",
            description: "Your quick note has been cleared.",
            duration: 2000,
        });
    };

    const saveButton = (
        <div className="flex gap-2">
            <Button
                onClick={(e) => {
                    e.stopPropagation();
                    handleClear();
                }}
                variant="ghost"
                size="sm"
                className="text-muted hover:text-destructive"
                disabled={!note || isSaving}
            >
                Clear
            </Button>
            <Button
                onClick={(e) => {
                    e.stopPropagation();
                    handleSave();
                }}
                variant="ghost"
                size="sm"
                className="text-primary hover:text-primary-hover"
                disabled={isSaving}
            >
                <Save className={`w-4 h-4 ${isSaving ? 'animate-spin' : ''}`} />
            </Button>
        </div>
    );

    return (
        <CollapsibleCard
            title="Quick Notes"
            icon={<StickyNote className="w-5 h-5 mr-2 text-primary" />}
            headerContent={saveButton}
        >
            <div className="space-y-2">
                <Textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Type your quick notes here..."
                    className="bg-background-hover border-border text-primary-foreground min-h-[200px] resize-none"
                />
                <p className="text-xs text-muted text-right">
                    {note.length} characters
                </p>
            </div>
        </CollapsibleCard>
    );
}; 