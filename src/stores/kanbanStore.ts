import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface KanbanColumn {
    id: string;
    title: string;
    taskIds: string[];
}

export interface KanbanBoard {
    id: string;
    title: string;
    description?: string;
    status: 'active' | 'archived';
    columns: KanbanColumn[];
    createdAt: Date;
    updatedAt: Date;
}

interface KanbanStore {
    boards: KanbanBoard[];
    activeBoard: KanbanBoard | null;

    createBoard: (title: string, columns: string[]) => KanbanBoard;
    updateBoard: (id: string, updates: Partial<KanbanBoard>) => void;
    deleteBoard: (boardId: string) => void;
    setActiveBoard: (board: KanbanBoard) => void;

    addColumn: (boardId: string, title: string) => void;
    updateColumn: (boardId: string, columnId: string, title: string) => void;
    deleteColumn: (boardId: string, columnId: string) => void;

    // Task management in boards
    addTaskToColumn: (boardId: string, columnId: string, taskId: string) => void;
    removeTaskFromColumn: (boardId: string, columnId: string, taskId: string) => void;
    moveTask: (taskId: string, sourceBoardId: string, sourceColumnId: string, targetColumnId: string) => void;
}

export const useKanbanStore = create<KanbanStore>()(
    persist(
        (set, _) => ({
            boards: [],
            activeBoard: null,

            createBoard: (title, columns = []) => {
                const newBoard: KanbanBoard = {
                    id: crypto.randomUUID(),
                    title,
                    status: 'active',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    columns: columns.map(columnTitle => ({
                        id: crypto.randomUUID(),
                        title: columnTitle,
                        taskIds: [],
                    })),
                };

                set((state) => ({
                    boards: [...state.boards, newBoard],
                    activeBoard: newBoard,
                }));

                return newBoard;
            },

            updateBoard: (id, updates) => {
                set((state) => ({
                    boards: state.boards.map((board) =>
                        board.id === id
                            ? {
                                ...board,
                                ...updates,
                                updatedAt: new Date(),
                            }
                            : board
                    ),
                    activeBoard:
                        state.activeBoard?.id === id
                            ? {
                                ...state.activeBoard,
                                ...updates,
                                updatedAt: new Date(),
                            }
                            : state.activeBoard,
                }));
            },

            deleteBoard: (boardId) => {
                set((state) => ({
                    boards: state.boards.filter((board) => board.id !== boardId),
                    activeBoard: state.activeBoard?.id === boardId ? null : state.activeBoard,
                }));
            },

            setActiveBoard: (board) => {
                set({ activeBoard: board });
            },

            addColumn: (boardId, title) => {
                const newColumn: KanbanColumn = {
                    id: crypto.randomUUID(),
                    title,
                    taskIds: [],
                };

                set((state) => ({
                    boards: state.boards.map((board) =>
                        board.id === boardId
                            ? {
                                ...board,
                                columns: [...board.columns, newColumn],
                                updatedAt: new Date(),
                            }
                            : board
                    ),
                    activeBoard:
                        state.activeBoard?.id === boardId
                            ? {
                                ...state.activeBoard,
                                columns: [...state.activeBoard.columns, newColumn],
                                updatedAt: new Date(),
                            }
                            : state.activeBoard,
                }));
            },

            updateColumn: (boardId, columnId, title) => {
                set((state) => ({
                    boards: state.boards.map((board) =>
                        board.id === boardId
                            ? {
                                ...board,
                                columns: board.columns.map((col) =>
                                    col.id === columnId
                                        ? { ...col, title }
                                        : col
                                ),
                                updatedAt: new Date(),
                            }
                            : board
                    ),
                    activeBoard:
                        state.activeBoard?.id === boardId
                            ? {
                                ...state.activeBoard,
                                columns: state.activeBoard.columns.map((col) =>
                                    col.id === columnId
                                        ? { ...col, title }
                                        : col
                                ),
                                updatedAt: new Date(),
                            }
                            : state.activeBoard,
                }));
            },

            deleteColumn: (boardId, columnId) => {
                set((state) => ({
                    boards: state.boards.map((board) =>
                        board.id === boardId
                            ? {
                                ...board,
                                columns: board.columns.filter((col) => col.id !== columnId),
                                updatedAt: new Date(),
                            }
                            : board
                    ),
                    activeBoard:
                        state.activeBoard?.id === boardId
                            ? {
                                ...state.activeBoard,
                                columns: state.activeBoard.columns.filter(
                                    (col) => col.id !== columnId
                                ),
                                updatedAt: new Date(),
                            }
                            : state.activeBoard,
                }));
            },

            addTaskToColumn: (boardId, columnId, taskId) => {
                set((state) => ({
                    boards: state.boards.map((board) =>
                        board.id === boardId
                            ? {
                                ...board,
                                columns: board.columns.map((col) =>
                                    col.id === columnId
                                        ? {
                                            ...col,
                                            taskIds: [...col.taskIds, taskId],
                                        }
                                        : col
                                ),
                                updatedAt: new Date(),
                            }
                            : board
                    ),
                    activeBoard:
                        state.activeBoard?.id === boardId
                            ? {
                                ...state.activeBoard,
                                columns: state.activeBoard.columns.map((col) =>
                                    col.id === columnId
                                        ? {
                                            ...col,
                                            taskIds: [...col.taskIds, taskId],
                                        }
                                        : col
                                ),
                                updatedAt: new Date(),
                            }
                            : state.activeBoard,
                }));
            },

            removeTaskFromColumn: (boardId, columnId, taskId) => {
                set((state) => ({
                    boards: state.boards.map((board) =>
                        board.id === boardId
                            ? {
                                ...board,
                                columns: board.columns.map((col) =>
                                    col.id === columnId
                                        ? {
                                            ...col,
                                            taskIds: col.taskIds.filter((id) => id !== taskId),
                                        }
                                        : col
                                ),
                                updatedAt: new Date(),
                            }
                            : board
                    ),
                    activeBoard:
                        state.activeBoard?.id === boardId
                            ? {
                                ...state.activeBoard,
                                columns: state.activeBoard.columns.map((col) =>
                                    col.id === columnId
                                        ? {
                                            ...col,
                                            taskIds: col.taskIds.filter((id) => id !== taskId),
                                        }
                                        : col
                                ),
                                updatedAt: new Date(),
                            }
                            : state.activeBoard,
                }));
            },

            moveTask: (taskId, sourceBoardId, sourceColumnId, targetColumnId) => {
                set((state) => {
                    // Helper function to update columns
                    const updateColumns = (columns: KanbanColumn[]) =>
                        columns.map((col) => {
                            if (col.id === sourceColumnId) {
                                return {
                                    ...col,
                                    taskIds: col.taskIds.filter((id) => id !== taskId),
                                };
                            }
                            if (col.id === targetColumnId) {
                                return {
                                    ...col,
                                    taskIds: [...col.taskIds, taskId],
                                };
                            }
                            return col;
                        });

                    return {
                        boards: state.boards.map((board) =>
                            board.id === sourceBoardId
                                ? {
                                    ...board,
                                    columns: updateColumns(board.columns),
                                    updatedAt: new Date(),
                                }
                                : board
                        ),
                        activeBoard:
                            state.activeBoard?.id === sourceBoardId
                                ? {
                                    ...state.activeBoard,
                                    columns: updateColumns(state.activeBoard.columns),
                                    updatedAt: new Date(),
                                }
                                : state.activeBoard,
                    };
                });
            },
        }),
        {
            name: 'kanban-store',
        }
    )
);


