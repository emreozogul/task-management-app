import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Save, Archive } from 'lucide-react';

interface DocumentHeaderProps {
    title: string;
    status: string;
    titleInputRef: React.RefObject<HTMLInputElement>;
    onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onPublish: () => void;
    onArchive: () => void;
}

export const DocumentHeader = ({
    title,
    status,
    titleInputRef,
    onTitleChange,
    onPublish,
    onArchive,
}: DocumentHeaderProps) => (
    <div className="flex items-center justify-between bg-[#232430] p-4 rounded-lg">
        <Input
            ref={titleInputRef}
            value={title}
            onChange={onTitleChange}
            className="text-2xl font-bold w-1/2 bg-[#383844] border-[#4e4e59] text-white"
            placeholder="Document Title"
        />
        <div className="space-x-2">
            <Button
                onClick={onPublish}
                variant="secondary"
                disabled={status === 'published'}
                className="bg-[#6775bc] hover:bg-[#7983c4] text-white disabled:opacity-50"
            >
                <Save className="w-4 h-4 mr-2" />
                {status === 'published' ? 'Published' : 'Publish'}
            </Button>
            <Button
                onClick={onArchive}
                variant="outline"
                disabled={status === 'archived'}
                className="border-[#383844] text-white hover:bg-[#383844] disabled:opacity-50"
            >
                <Archive className="w-4 h-4 mr-2" />
                Archive
            </Button>
        </div>
    </div>
);
