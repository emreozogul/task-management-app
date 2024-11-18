import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Task, TaskPriority } from '@/types/task';
import { TaskValidationService } from '@/services/taskValidation';
import { TaskNotificationService } from '@/services/taskNotification';
import { TaskAnalyticsService } from '@/services/taskAnalytics';
import { TaskScheduler } from '@/services/taskScheduler';

export interface KanbanColumn {
    id: string;
    title: string;
    tasks: Task[];
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
    kanbanServices: KanbanServices;
    boards: KanbanBoard[];
    activeBoard: KanbanBoard | null;
    createBoard: (title: string) => KanbanBoard;
    updateBoard: (id: string, updates: Partial<KanbanBoard>) => void;
    setActiveBoard: (board: KanbanBoard) => void;
    moveTask: (taskId: string, sourceColumnId: string, targetColumnId: string) => void;
    addTask: (columnId: string, taskData: Partial<Task>) => void;
    updateTask: (columnId: string, taskId: string, updates: Partial<Task>) => void;
    deleteTask: (columnId: string, taskId: string) => void;
    getTaskAnalytics: () => {
        completionMetrics: ReturnType<TaskAnalyticsService['getCompletionMetrics']>;
        priorityDistribution: ReturnType<TaskAnalyticsService['getTaskDistributionByPriority']>;
    };
    generateTaskSchedule: () => Task[];
    initializeBoard: () => void;
}

class KanbanServices {
    public validation: TaskValidationService;
    public notification: TaskNotificationService;
    public analytics: TaskAnalyticsService;
    public scheduler: TaskScheduler;

    constructor(tasks: Task[] = []) {
        this.validation = new TaskValidationService(tasks);
        this.notification = new TaskNotificationService();
        this.analytics = new TaskAnalyticsService(tasks);
        this.scheduler = new TaskScheduler(tasks);
    }

    updateTasks(tasks: Task[]) {
        this.validation = new TaskValidationService(tasks);
        this.analytics = new TaskAnalyticsService(tasks);
        this.scheduler = new TaskScheduler(tasks);
    }
}

const kanbanServices = new KanbanServices();

export const useKanbanStore = create<KanbanStore>()(
    persist(
        (set, get) => ({
            boards: [],
            activeBoard: null,
            kanbanServices: kanbanServices,
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

                    const validation = kanbanServices.validation.validateColumnTransition(sourceColumnId, targetColumnId);
                    if (!validation.valid) {
                        console.error(validation.message);
                        return state;
                    }

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
                            const movedTask = { ...task, columnId: targetColumnId };
                            kanbanServices.notification.notifyTaskUpdate(movedTask, 'moved');
                            return {
                                ...col,
                                tasks: [...col.tasks, movedTask],
                            };
                        }
                        return col;
                    });

                    const updatedBoard = {
                        ...state.activeBoard,
                        columns: updatedColumns,
                        updatedAt: new Date(),
                    };

                    const allTasks = updatedBoard.columns.flatMap(col => col.tasks);
                    kanbanServices.updateTasks(allTasks);

                    return {
                        ...state,
                        boards: state.boards.map(board =>
                            board.id === updatedBoard.id ? updatedBoard : board
                        ),
                        activeBoard: updatedBoard,
                    };
                }),
            addTask: (columnId, taskData) => {
                set((state) => {
                    if (!state.activeBoard) return state;

                    const newTask: Task = {
                        id: crypto.randomUUID(),
                        title: taskData.title || 'New Task',
                        description: taskData.description || '',
                        documentId: taskData.documentId,
                        priority: taskData.priority || TaskPriority.LOW,
                        createdAt: taskData.createdAt || new Date().toISOString(),
                        updatedAt: taskData.updatedAt || new Date().toISOString(),
                        columnId: columnId,
                        completed: taskData.completed || false,
                        labels: taskData.labels || [],
                        deadline: taskData.deadline,
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

                    // Update services with new task list
                    const allTasks = updatedBoard.columns.flatMap(col => col.tasks);
                    kanbanServices.updateTasks(allTasks);

                    // Send notification
                    kanbanServices.notification.notifyTaskUpdate(newTask, 'created');

                    return {
                        boards: state.boards.map((board) =>
                            board.id === updatedBoard.id ? updatedBoard : board
                        ),
                        activeBoard: updatedBoard,
                    };
                });
            },
            updateTask: (columnId: string, taskId: string, updates: Partial<Task>) => {
                set((state) => {
                    if (!state.activeBoard) return state;

                    const currentTask = state.activeBoard.columns
                        .find(col => col.id === columnId)
                        ?.tasks.find(task => task.id === taskId);

                    if (!currentTask) return state;

                    const validation = kanbanServices.validation.validateTaskUpdate(currentTask, updates);
                    if (!validation.valid) {
                        console.error(validation.message);
                        return state;
                    }

                    const updatedColumns = state.activeBoard.columns.map(col => {
                        if (col.id === columnId) {
                            return {
                                ...col,
                                tasks: col.tasks.map(task => {
                                    if (task.id === taskId) {
                                        const updatedTask = {
                                            ...task,
                                            ...updates,
                                            updatedAt: new Date().toISOString()
                                        };

                                        // Notify about task update
                                        const updateType = updates.completed ? 'completed' : 'updated';
                                        kanbanServices.notification.notifyTaskUpdate(updatedTask, updateType);

                                        return updatedTask;
                                    }
                                    return task;
                                })
                            };
                        }
                        return col;
                    });

                    const updatedBoard = {
                        ...state.activeBoard,
                        columns: updatedColumns,
                        updatedAt: new Date(),
                    };

                    const allTasks = updatedBoard.columns.flatMap(col => col.tasks);
                    kanbanServices.updateTasks(allTasks);

                    return {
                        ...state,
                        boards: state.boards.map(board =>
                            board.id === updatedBoard.id ? updatedBoard : board
                        ),
                        activeBoard: updatedBoard,
                    };
                });
            },
            deleteTask: (columnId: string, taskId: string) =>
                set((state) => ({
                    boards: state.boards.map(board => {
                        if (board.id === state.activeBoard?.id) {
                            return {
                                ...board,
                                columns: board.columns.map(col => {
                                    if (col.id === columnId) {
                                        return {
                                            ...col,
                                            tasks: col.tasks.filter(task => task.id !== taskId)
                                        };
                                    }
                                    return col;
                                })
                            };
                        }
                        return board;
                    })
                })),
            getTaskAnalytics: () => {
                const state = get();
                if (!state.activeBoard) return {
                    completionMetrics: {
                        completionRate: 0,
                        averageCompletionTime: 0,
                        overdueTasks: []
                    },
                    priorityDistribution: {
                        high: 0,
                        medium: 0,
                        low: 0
                    }
                };

                const allTasks = state.activeBoard.columns.flatMap(col => col.tasks);
                kanbanServices.updateTasks(allTasks);

                return {
                    completionMetrics: kanbanServices.analytics.getCompletionMetrics(),
                    priorityDistribution: kanbanServices.analytics.getTaskDistributionByPriority()
                };
            },
            generateTaskSchedule: () => {
                const state = get();
                if (!state.activeBoard) return [];

                const allTasks = state.activeBoard.columns.flatMap(col => col.tasks);
                kanbanServices.updateTasks(allTasks);
                return kanbanServices.scheduler.generateSchedule();
            },
            initializeBoard: () => {
                set((state) => {
                    if (!state.activeBoard) {
                        const defaultBoard: KanbanBoard = {
                            id: crypto.randomUUID(),
                            title: 'Default Board',
                            status: 'active',
                            columns: [
                                {
                                    id: crypto.randomUUID(),
                                    title: 'To Do',
                                    tasks: []
                                },
                                {
                                    id: crypto.randomUUID(),
                                    title: 'In Progress',
                                    tasks: []
                                },
                                {
                                    id: crypto.randomUUID(),
                                    title: 'Done',
                                    tasks: []
                                }
                            ],
                            createdAt: new Date(),
                            updatedAt: new Date()
                        };

                        return {
                            boards: [defaultBoard],
                            activeBoard: defaultBoard
                        };
                    }
                    return state;
                });
            }
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