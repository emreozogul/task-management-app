import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Task, TaskPriority } from '@/types/task';
import { TaskNotificationService } from '@/services/taskNotification';
import { TaskAnalyticsService } from '@/services/taskAnalytics';
import { TaskScheduler } from '@/services/taskScheduler';

interface TaskStore {
    tasks: Task[];
    services: {
        notification: TaskNotificationService;
        analytics: TaskAnalyticsService;
        scheduler: TaskScheduler;
    };

    // Task CRUD operations
    createTask: (taskData: Partial<Task>) => Task;
    updateTask: (taskId: string, updates: Partial<Task>) => void;
    deleteTask: (taskId: string) => void;

    // Task queries
    getTaskById: (taskId: string) => Task | undefined;
    getTasksByDateRange: (startDate: Date, endDate: Date) => Task[];
    getTasksByIds: (taskIds: string[]) => Task[];
    getAllTasks: () => Task[];

    // Analytics
    getTaskAnalytics: () => {
        completionMetrics: ReturnType<TaskAnalyticsService['getCompletionMetrics']>;
        priorityDistribution: ReturnType<TaskAnalyticsService['getTaskDistributionByPriority']>;
    };
}

// Create services outside of the store
const notificationService = new TaskNotificationService();
const createServices = (tasks: Task[] = []) => ({
    notification: notificationService,
    analytics: new TaskAnalyticsService(tasks),
    scheduler: new TaskScheduler(tasks),
});

export const useTaskStore = create<TaskStore>()(
    persist(
        (set, get) => ({
            tasks: [],
            services: createServices(),

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
                    const newServices = createServices(newTasks);

                    try {
                        newServices.notification.notifyTaskUpdate(newTask, 'created');
                    } catch (error) {
                        console.error('Notification error:', error);
                    }

                    return {
                        tasks: newTasks,
                        services: newServices,
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

                    const updatedTask = updatedTasks.find(t => t.id === taskId);
                    const newServices = createServices(updatedTasks);

                    if (updatedTask) {
                        try {
                            newServices.notification.notifyTaskUpdate(
                                updatedTask,
                                updates.completed !== undefined ? 'completed' : 'updated'
                            );
                        } catch (error) {
                            console.error('Notification error:', error);
                        }
                    }

                    return {
                        tasks: updatedTasks,
                        services: newServices,
                    };
                });
            },

            deleteTask: (taskId) => {
                set((state) => {
                    const task = state.tasks.find(t => t.id === taskId);
                    const updatedTasks = state.tasks.filter(t => t.id !== taskId);
                    const newServices = createServices(updatedTasks);

                    if (task) {
                        try {
                            newServices.notification.notifyTaskUpdate(task, 'deleted');
                        } catch (error) {
                            console.error('Notification error:', error);
                        }
                    }

                    return {
                        tasks: updatedTasks,
                        services: newServices,
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

            getTaskAnalytics: () => {
                const { analytics } = get().services;
                return {
                    completionMetrics: analytics.getCompletionMetrics(),
                    priorityDistribution: analytics.getTaskDistributionByPriority(),
                };
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