import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface TagListProps {
    tags: string[];
    onAddTag: () => void;
}

export const TagList = ({ tags, onAddTag }: TagListProps) => (
    <div className="flex items-center space-x-2">
        {tags.map((tag) => (
            <Badge key={tag} variant="secondary">
                {tag}
            </Badge>
        ))}
        <Button onClick={onAddTag} variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Tag
        </Button>
    </div>
); 