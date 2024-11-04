import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Card } from './Card';

interface ColumnProps {
    id: string;
    title: string;
    cards: Array<{ id: string; title: string }>;
}

export const Column = ({ id, title, cards }: ColumnProps) => {
    const { setNodeRef } = useDroppable({ id });

    return (
        <div className="bg-[#232430] p-4 rounded-lg w-80">
            <h2 className="font-bold mb-4">{title}</h2>
            <div ref={setNodeRef}>
                <SortableContext items={cards.map(card => card.id)} strategy={verticalListSortingStrategy}>
                    {cards.map((card, index) => (
                        <Card key={card.id} {...card} index={index} />
                    ))}
                </SortableContext>
            </div>
        </div>
    );
};
