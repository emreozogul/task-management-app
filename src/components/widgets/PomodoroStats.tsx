import { usePomodoroStore } from '@/stores/pomodoroStore';
import { format } from 'date-fns';
import { Clock, TrendingUp, Award, Target, Zap } from 'lucide-react';
import { Card } from '@/components/ui/card';

export const PomodoroStats = () => {
    const { dailyStats, statistics, currentStreak, longestStreak } = usePomodoroStore();

    // Calculate averages
    const averageDailyFocusTime = statistics.totalWorkTime / (dailyStats.length || 1) / 3600;
    const averageDailySessions = statistics.totalSessions / (dailyStats.length || 1);

    // Get today's stats
    const todayStats = dailyStats.find(
        stat => stat.date === new Date().toISOString().split('T')[0]
    );

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <Card className="p-4">
                    <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-primary" />
                        <h3 className="text-sm font-medium">Today's Focus</h3>
                    </div>
                    <p className="text-2xl font-bold mt-2">
                        {todayStats ? Math.round(todayStats.totalFocusTime / 3600 * 10) / 10 : 0}h
                    </p>
                    <p className="text-sm text-muted-foreground">
                        {todayStats?.sessionsCompleted || 0} sessions completed
                    </p>
                </Card>

                <Card className="p-4">
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-primary" />
                        <h3 className="text-sm font-medium">Total Focus Time</h3>
                    </div>
                    <p className="text-2xl font-bold mt-2">
                        {Math.round(statistics.totalWorkTime / 3600)}h
                    </p>
                    <p className="text-sm text-muted-foreground">
                        {statistics.totalSessions} total sessions
                    </p>
                </Card>

                <Card className="p-4">
                    <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-primary" />
                        <h3 className="text-sm font-medium">Daily Average</h3>
                    </div>
                    <p className="text-2xl font-bold mt-2">
                        {averageDailyFocusTime.toFixed(1)}h
                    </p>
                    <p className="text-sm text-muted-foreground">
                        {averageDailySessions.toFixed(1)} sessions/day
                    </p>
                </Card>

                <Card className="p-4">
                    <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-primary" />
                        <h3 className="text-sm font-medium">Streaks</h3>
                    </div>
                    <p className="text-2xl font-bold mt-2">
                        {currentStreak} days
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Best: {longestStreak} days
                    </p>
                </Card>
            </div>

            {statistics.bestDay && (
                <Card className="p-4">
                    <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-primary" />
                        <h3 className="text-sm font-medium">Best Day</h3>
                    </div>
                    <p className="text-2xl font-bold mt-2">
                        {format(new Date(statistics.bestDay.date), 'MMM d, yyyy')}
                    </p>
                    <p className="text-sm text-muted-foreground">
                        {statistics.bestDay.sessions} sessions completed
                    </p>
                </Card>
            )}
        </div>
    );
}; 