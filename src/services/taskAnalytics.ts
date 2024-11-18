import { Task } from '@/types/task';

export class TaskAnalyticsService {
    constructor(private tasks: Task[]) { }

    public getCompletionMetrics() {
        const totalTasks = this.tasks.length;
        const completedTasks = this.tasks.filter(t => t.completed).length;

        return {
            completionRate: (completedTasks / totalTasks) * 100,
            averageCompletionTime: this.calculateAverageCompletionTime(),
            overdueTasks: this.getOverdueTasks(),
        };
    }

    private calculateAverageCompletionTime(): number {
        const completedTasks = this.tasks.filter(t => t.completed);
        const totalTime = completedTasks.reduce((acc, task) => {
            const start = new Date(task.createdAt);
            const end = new Date(task.updatedAt);
            return acc + (end.getTime() - start.getTime());
        }, 0);

        return completedTasks.length ? totalTime / completedTasks.length : 0;
    }

    private getOverdueTasks(): Task[] {
        const now = new Date();
        return this.tasks.filter(task => {
            if (!task.deadline || task.completed) return false;
            return new Date(task.deadline) < now;
        });
    }

    public getTaskDistributionByPriority() {
        return {
            high: this.tasks.filter(t => t.priority === 'high').length,
            medium: this.tasks.filter(t => t.priority === 'medium').length,
            low: this.tasks.filter(t => t.priority === 'low').length,
        };
    }
}