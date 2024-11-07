import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface TagManagerProps {
    tags: string[];
    onAddTag: () => void;
    onRemoveTag?: (tag: string) => void;
}

export const TagManager = ({ tags, onAddTag, onRemoveTag }: TagManagerProps) => (
    <div className="flex items-center space-x-2 bg-[#232430] p-3 rounded-lg">
        {tags.map((tag) => (
            <Badge
                key={tag}
                variant="secondary"
                className="bg-[#383844] text-white hover:bg-[#4e4e59] cursor-pointer"
                onClick={() => onRemoveTag?.(tag)}
            >
                {tag}
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