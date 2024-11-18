import { Task } from '@/types/task';

export class TaskScheduler {
    constructor(private tasks: Task[], private workingHours: number = 8) { }

    public generateSchedule(): Task[] {
        const sortedTasks = this.sortTasksByPriority();
        return sortedTasks.map((task, index) => ({
            ...task,
            deadline: this.calculateDeadline(task, index)
        }));
    }

    private sortTasksByPriority(): Task[] {
        return [...this.tasks].sort((a, b) => {
            const priorityScore = this.getPriorityScore(b) - this.getPriorityScore(a);
            return priorityScore;
        });
    }

    private getPriorityScore(task: Task): number {
        const priorityScores: Record<string, number> = {
            high: 3,
            medium: 2,
            low: 1
        };
        return priorityScores[task.priority] || 1;
    }

    private calculateDeadline(task: Task, index: number): string {
        const baseDate = new Date();
        baseDate.setDate(baseDate.getDate() + Math.floor(index / this.workingHours));
        return baseDate.toISOString();
    }
}