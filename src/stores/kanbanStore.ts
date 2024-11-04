import { create } from 'zustand';

export interface KanbanCard {
    id: string;
    title: string;
    description?: string;
}

export interface KanbanColumn {
    id: string;
    title: string;
    cards: KanbanCard[];
}

export interface KanbanBoard {
    id: string;
    title: string;
    columns: KanbanColumn[];
}

interface KanbanStore {
    boards: KanbanBoard[];
    activeBoard: KanbanBoard | null;
    setActiveBoard: (board: KanbanBoard) => void;
    moveCard: (cardId: string, sourceColumn: string, targetColumn: string) => void;
}

export const useKanbanStore = create<KanbanStore>((set) => ({
    boards: [
        {
            id: 'main',
            title: 'Main Board',
            columns: [
                { id: 'todo', title: 'To Do', cards: [] },
                { id: 'in-progress', title: 'In Progress', cards: [] },
                { id: 'done', title: 'Done', cards: [] },
            ],
        },
    ],
    activeBoard: null,
    setActiveBoard: (board) => set({ activeBoard: board }),
    moveCard: (cardId, sourceColumn, targetColumn) =>
        set((state) => {
            if (!state.activeBoard) return state;

            const newColumns = state.activeBoard.columns.map((col) => {
                if (col.id === sourceColumn) {
                    return {
                        ...col,
                        cards: col.cards.filter((card) => card.id !== cardId),
                    };
                }
                if (col.id === targetColumn) {
                    const card = state.activeBoard?.columns
                        .find((c) => c.id === sourceColumn)
                        ?.cards.find((c) => c.id === cardId);
                    if (card) {
                        return {
                            ...col,
                            cards: [...col.cards, card],
                        };
                    }
                }
                return col;
            });

            return {
                ...state,
                activeBoard: {
                    ...state.activeBoard,
                    columns: newColumns,
                },
            };
        }),
}));