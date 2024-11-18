export type TaskUpdateType =
    | 'created'
    | 'updated'
    | 'deleted'
    | 'moved'
    | 'completed';

export interface TaskNotification {
    id: string;
    taskId: string;
    taskTitle: string;
    type: TaskUpdateType;
    message: string;
    timestamp: string;
}