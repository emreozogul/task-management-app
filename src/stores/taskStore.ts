import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Task, TaskPriority } from '@/types/task';

interface TaskStore {
    tasks: Task[];

    // Task CRUD operations
    createTask: (taskData: Partial<Task>) => Task;
    updateTask: (taskId: string, updates: Partial<Task>) => void;
    deleteTask: (taskId: string) => void;

    // Task queries
    getTaskById: (taskId: string) => Task | undefined;
    getTasksByDateRange: (startDate: Date, endDate: Date) => Task[];
    getTasksByIds: (taskIds: string[]) => Task[];
    getAllTasks: () => Task[];

}

export const useTaskStore = create<TaskStore>()(
    persist(
        (set, get) => ({
            tasks: [],

            createTask: (taskData) => {
                const newTask: Task = {
                    id: crypto.randomUUID(),
                    title: taskData.title || 'New Task',
                    description: taskData.description || '',
                    priority: taskData.priority || TaskPriority.LOW,
                    completed: false,
                    labels: [],
                    startDate: taskData.startDate || new Date().toISOString(),
                    endDate: taskData.endDate || new Date().toISOString(),
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    ...taskData,
                };

                set((state) => {
                    const newTasks = [...state.tasks, newTask];

                    return {
                        tasks: newTasks,
                    };
                });

                return newTask;
            },

            updateTask: (taskId, updates) => {
                set((state) => {
                    const updatedTasks = state.tasks.map((task) =>
                        task.id === taskId
                            ? { ...task, ...updates, updatedAt: new Date().toISOString() }
                            : task
                    );

                    return {
                        tasks: updatedTasks,
                    };
                });
            },

            deleteTask: (taskId) => {
                set((state) => {
                    const updatedTasks = state.tasks.filter(t => t.id !== taskId);

                    return {
                        tasks: updatedTasks,
                    };
                });
            },

            // ... rest of the implementation remains the same

            getTaskById: (taskId) => {
                return get().tasks.find(task => task.id === taskId);
            },

            getTasksByIds: (taskIds) => {
                return get().tasks.filter(task => taskIds.includes(task.id));
            },

            getTasksByDateRange: (startDate: Date, endDate: Date) => {
                return get().tasks.filter((task) => {
                    if (!task.startDate || !task.endDate) return false;
                    const taskStart = new Date(task.startDate);
                    const taskEnd = new Date(task.endDate);
                    return !(taskEnd < startDate || taskStart > endDate);
                });
            },

            getAllTasks: () => {
                return get().tasks;
            },


        }),
        {
            name: 'task-store',
            partialize: (state) => ({
                tasks: state.tasks,
            }),
        }
    )
);