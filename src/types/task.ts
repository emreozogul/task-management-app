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
    priority: TaskPriority;
    documentId?: string;
    columnId: string;
    completed: boolean;
    labels: string[];
    createdAt: string;
    updatedAt: string;
    deadline?: string | null;
}