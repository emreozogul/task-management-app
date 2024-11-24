import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';

interface TagManagerProps {
    tags: string[] | undefined;
    onAddTag: () => void;
    onRemoveTag: (tag: string) => void;
}

export const TagManager = ({ tags = [], onAddTag, onRemoveTag }: TagManagerProps) => (
    <div className="flex flex-wrap items-center gap-2 bg-background-secondary p-3 rounded-lg">
        {(tags || []).map((tag) => (
            <Badge
                key={tag}
                variant="secondary"
                className="bg-background-hover text-primary-foreground hover:bg-background-hover-dark group flex items-center gap-1"
            >
                {tag}
                <X
                    className="w-3 h-3 opacity-60 group-hover:opacity-100 cursor-pointer"
                    onClick={() => onRemoveTag(tag)}
                />
            </Badge>
        ))}
        <Button
            onClick={onAddTag}
            variant="outline"
            size="sm"
            className="border-border text-primary-foreground hover:bg-background-hover"
        >
            <Plus className="w-4 h-4 mr-2" />
            Add Tag
        </Button>
    </div>
);
