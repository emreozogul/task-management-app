import { Task } from '@/types/task';
import { TaskNotification, TaskUpdateType } from '@/types/notification';

export class TaskNotificationService {
    private subscribers: Map<string, (notification: TaskNotification) => void>;

    constructor() {
        this.subscribers = new Map();
    }

    public subscribe(userId: string, callback: (notification: TaskNotification) => void) {
        this.subscribers.set(userId, callback);
    }

    public unsubscribe(userId: string) {
        this.subscribers.delete(userId);
    }

    public notifyTaskUpdate(task: Task, updateType: TaskUpdateType) {
        const notification = this.createNotification(task, updateType);
        this.broadcastNotification(notification);
    }

    private createNotification(task: Task, type: TaskUpdateType): TaskNotification {
        return {
            id: crypto.randomUUID(),
            taskId: task.id,
            taskTitle: task.title,
            type,
            message: this.getNotificationMessage(task, type),
            timestamp: new Date().toISOString()
        };
    }

    private getNotificationMessage(task: Task, type: TaskUpdateType): string {
        switch (type) {
            case 'created':
                return `Task "${task.title}" has been created`;
            case 'updated':
                return `Task "${task.title}" has been updated`;
            case 'deleted':
                return `Task "${task.title}" has been deleted`;
            case 'moved':
                return `Task "${task.title}" has been moved to a new column`;
            case 'completed':
                return `Task "${task.title}" has been marked as completed`;
            default:
                return `Task "${task.title}" has been modified`;
        }
    }

    private broadcastNotification(notification: TaskNotification) {
        this.subscribers.forEach(callback => {
            callback(notification);
        });
    }
}