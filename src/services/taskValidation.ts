import { Task, TaskStatus } from '@/types/task';

interface ValidationResult {
    valid: boolean;
    message?: string;
}

export class TaskValidationService {
    constructor(private tasks: Task[]) { }

    public validateTaskUpdate(task: Task, updates: Partial<Task>): ValidationResult {
        if (updates.deadline) {
            const deadlineDate = new Date(updates.deadline);
            if (isNaN(deadlineDate.getTime())) {
                return {
                    valid: false,
                    message: 'Invalid deadline date'
                };
            }
        }

        if (updates.columnId) {
            return this.validateColumnTransition(task.columnId, updates.columnId);
        }

        return { valid: true };
    }

    public validateColumnTransition(currentColumnId: string, newColumnId: string): ValidationResult {
        const allowedTransitions: Record<string, string[]> = {
            'todo': ['in-progress'],
            'in-progress': ['todo', 'done'],
            'done': ['in-progress']
        };

        return {
            valid: allowedTransitions[currentColumnId]?.includes(newColumnId) ?? false,
            message: `Invalid column transition from ${currentColumnId} to ${newColumnId}`
        };
    }
}