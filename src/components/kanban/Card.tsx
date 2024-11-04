import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface CardProps {
    id: string;
    title: string;
    index: number;
}

export const Card = ({ id, title }: CardProps) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="bg-[#383844] p-4 rounded-lg shadow mb-2 cursor-move text-white"
        >
            {title}
        </div>
    );
};
