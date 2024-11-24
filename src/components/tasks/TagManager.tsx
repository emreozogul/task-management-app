import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';

interface TagManagerProps {
    tags: string[] | undefined;
    onAddTag: () => void;
    onRemoveTag: (tag: string) => void;
}

export const TagManager = ({ tags = [], onAddTag, onRemoveTag }: TagManagerProps) => (
    <div className="flex flex-wrap items-center gap-2 bg-[#232430] p-3 rounded-lg">
        {(tags || []).map((tag) => (
            <Badge
                key={tag}
                variant="secondary"
                className="bg-[#383844] text-white hover:bg-[#4e4e59] group flex items-center gap-1"
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
            className="border-[#383844] text-white hover:bg-[#383844]"
        >
            <Plus className="w-4 h-4 mr-2" />
            Add Tag
        </Button>
    </div>
);
