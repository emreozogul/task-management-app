export interface Task {
    id: string;
    title: string;
    description?: string;
    documentId?: string;  // Reference to linked document
    completed: boolean;  // Added checkbox state
    labels: string[];
    dueDate?: string | Date;  // Making it optional with '?'
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
