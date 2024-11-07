import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface KanbanTask {
    id: string;
    title: string;
    description?: string;
    documentId?: string;
    priority: 'low' | 'medium' | 'high';
    createdAt: Date;
    updatedAt: Date;
    columnId: string;
    deadline?: string;
}

export interface KanbanColumn {
    id: string;
    title: string;
    tasks: KanbanTask[];
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
    createBoard: (title: string) => KanbanBoard;
    updateBoard: (id: string, updates: Partial<KanbanBoard>) => void;
    setActiveBoard: (board: KanbanBoard) => void;
    moveTask: (taskId: string, sourceColumnId: string, targetColumnId: string) => void;
    addTask: (columnId: string, taskData: Partial<KanbanTask>) => void;
    addColumn: (boardId: string, title: string) => void;
    updateTask: (columnId: string, taskId: string, updates: Partial<KanbanTask>) => void;
    deleteTask: (columnId: string, taskId: string) => void;
}

export const useKanbanStore = create<KanbanStore>()(
    persist(
        (set) => ({
            boards: [],
            activeBoard: null,
            createBoard: (title) => {
                const newBoard: KanbanBoard = {
                    id: crypto.randomUUID(),
                    title,
                    status: 'active',
                    columns: [
                        { id: 'todo', title: 'To Do', tasks: [] },
                        { id: 'in-progress', title: 'In Progress', tasks: [] },
                        { id: 'done', title: 'Done', tasks: [] },
                    ],
                    createdAt: new Date(),
                    updatedAt: new Date(),
                };

                set((state) => ({
                    boards: [...state.boards, newBoard],
                }));

                return newBoard;
            },
            updateBoard: (id, updates) => {
                set((state) => ({
                    boards: state.boards.map((board) =>
                        board.id === id ? { ...board, ...updates, updatedAt: new Date() } : board
                    ),
                }));
            },
            setActiveBoard: (board) => set({ activeBoard: board }),
            moveTask: (taskId: string, sourceColumnId: string, targetColumnId: string) =>
                set((state) => {
                    if (!state.activeBoard) return state;

                    const sourceColumn = state.activeBoard.columns.find(
                        (col) => col.id === sourceColumnId
                    );
                    const task = sourceColumn?.tasks.find((t) => t.id === taskId);

                    if (!task) return state;

                    const updatedColumns = state.activeBoard.columns.map((col) => {
                        if (col.id === sourceColumnId) {
                            return {
                                ...col,
                                tasks: col.tasks.filter((t) => t.id !== taskId),
                            };
                        }
                        if (col.id === targetColumnId) {
                            return {
                                ...col,
                                tasks: [...col.tasks, task],
                            };
                        }
                        return col;
                    });

                    const updatedBoard = {
                        ...state.activeBoard,
                        columns: updatedColumns,
                        updatedAt: new Date(),
                    };

                    return {
                        ...state,
                        boards: state.boards.map((board) =>
                            board.id === updatedBoard.id ? updatedBoard : board
                        ),
                        activeBoard: updatedBoard,
                    };
                }),
            addTask: (columnId, taskData) => {
                set((state) => {
                    if (!state.activeBoard) return state;

                    const newTask: KanbanTask = {
                        id: crypto.randomUUID(),
                        title: taskData.title || 'New Task',
                        description: taskData.description,
                        documentId: taskData.documentId,
                        priority: taskData.priority || 'low',
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        columnId: columnId,
                    };

                    const updatedColumns = state.activeBoard.columns.map((col) =>
                        col.id === columnId
                            ? { ...col, tasks: [...col.tasks, newTask] }
                            : col
                    );

                    const updatedBoard = {
                        ...state.activeBoard,
                        columns: updatedColumns,
                        updatedAt: new Date(),
                    };

                    return {
                        boards: state.boards.map((board) =>
                            board.id === updatedBoard.id ? updatedBoard : board
                        ),
                        activeBoard: updatedBoard,
                    };
                });
            },
            addColumn: (boardId, title) => {
                set((state) => {
                    const newColumn = {
                        id: crypto.randomUUID(),
                        title,
                        tasks: [],
                    };

                    return {
                        boards: state.boards.map((board) =>
                            board.id === boardId
                                ? {
                                    ...board,
                                    columns: [...board.columns, newColumn],
                                    updatedAt: new Date(),
                                }
                                : board
                        ),
                        activeBoard: state.activeBoard?.id === boardId
                            ? {
                                ...state.activeBoard,
                                columns: [...state.activeBoard.columns, newColumn],
                            }
                            : state.activeBoard,
                    };
                });
            },
            updateTask: (columnId: string, taskId: string, updates: Partial<KanbanTask>) =>
                set((state) => {
                    if (!state.activeBoard) return state;

                    const updatedColumns = state.activeBoard.columns.map(col => {
                        if (col.id === columnId) {
                            return {
                                ...col,
                                tasks: col.tasks.map(task =>
                                    task.id === taskId
                                        ? { ...task, ...updates, updatedAt: new Date() }
                                        : task
                                )
                            };
                        }
                        return col;
                    });

                    const updatedBoard = {
                        ...state.activeBoard,
                        columns: updatedColumns,
                        updatedAt: new Date(),
                    };

                    return {
                        ...state,
                        boards: state.boards.map(board =>
                            board.id === updatedBoard.id ? updatedBoard : board
                        ),
                        activeBoard: updatedBoard,
                    };
                }),
            deleteTask: (columnId: string, taskId: string) =>
                set((state) => {
                    if (!state.activeBoard) return state;

                    const updatedColumns = state.activeBoard.columns.map(col => {
                        if (col.id === columnId) {
                            return {
                                ...col,
                                tasks: col.tasks.filter(task => task.id !== taskId)
                            };
                        }
                        return col;
                    });

                    const updatedBoard = {
                        ...state.activeBoard,
                        columns: updatedColumns,
                        updatedAt: new Date(),
                    };

                    return {
                        ...state,
                        boards: state.boards.map(board =>
                            board.id === updatedBoard.id ? updatedBoard : board
                        ),
                        activeBoard: updatedBoard,
                    };
                }),
        }),
        {
            name: 'kanban-store',
            storage: {
                getItem: (name) => {
                    const str = localStorage.getItem(name);
                    if (!str) return null;
                    return JSON.parse(str);
                },
                setItem: (name, value) => {
                    localStorage.setItem(name, JSON.stringify(value));
                },
                removeItem: (name) => {
                    localStorage.removeItem(name);
                },
            },
        }
    )
);