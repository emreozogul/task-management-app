export enum TaskPriority {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high'
}

export enum TaskStatus {
    TODO = 'todo',
    IN_PROGRESS = 'in-progress',
    DONE = 'done'
}

export interface Task {
    id: string;
    title: string;
    description?: string;
    startDate?: string;
    endDate?: string;
    priority: TaskPriority;
    completed: boolean;
    documentId?: string;
    labels: string[];
    createdAt: string;
    updatedAt: string;
}