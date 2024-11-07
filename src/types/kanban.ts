export interface Task {
    id: string;
    title: string;
    description?: string;
    documentId?: string;  // Reference to linked document
    labels: string[];
    dueDate?: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface Column {
    id: string;
    title: string;
    tasks: Task[];
}

export interface Board {
    id: string;
    title: string;
    description?: string;
    status: 'active' | 'archived';
    columns: Column[];
    createdAt: Date;
    updatedAt: Date;
}
