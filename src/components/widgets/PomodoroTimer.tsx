import { usePomodoroStore } from '@/stores/pomodoroStore';
import { Button } from '@/components/ui/button';
import { Timer, Pause, Play, RotateCcw } from 'lucide-react';
import { PomodoroSettings } from './PomodoroSettings';
import { CollapsibleCard } from '@/components/ui/collapsible-card';

export const PomodoroTimer = () => {
    const {
        isRunning,
        timeLeft,
        isWorkSession,
        statistics,
        startTimer,
        pauseTimer,
        resetTimer,
    } = usePomodoroStore();

    const formatTime = (seconds: number): string => {
        const hours = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        if (hours > 0) {
            return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const formatDuration = (seconds: number): string => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        return `${hours}h ${minutes}m`;
    };

    const settingsButton = (
        <div onClick={(e) => e.stopPropagation()}>
            <PomodoroSettings />
        </div>
    );

    return (
        <CollapsibleCard
            title={isWorkSession ? 'Work Session' : 'Break Time'}
            icon={<Timer className="w-5 h-5 mr-2 text-primary" />}
            headerContent={settingsButton}
        >
            <div className="flex flex-col">
                <div className="text-4xl font-mono text-primary-foreground text-center mb-6">
                    {formatTime(timeLeft)}
                </div>

                <div className="flex justify-center space-x-4 mb-6">
                    <Button
                        onClick={() => (isRunning ? pauseTimer() : startTimer())}
                        className="bg-primary hover:bg-primary-hover"
                    >
                        {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </Button>
                    <Button
                        onClick={resetTimer}
                        variant="outline"
                        className="border-background-hover text-primary-foreground hover:bg-background-hover"
                    >
                        <RotateCcw className="w-4 h-4" />
                    </Button>
                </div>

                <div className="border-t border-background-hover pt-4">
                    <h3 className="text-sm font-medium text-primary-foreground mb-2">Statistics</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <div className="text-muted">Total Focus Time</div>
                            <div className="text-primary-foreground">{formatDuration(statistics.totalWorkTime)}</div>
                        </div>
                        <div>
                            <div className="text-muted">Completed Sessions</div>
                            <div className="text-primary-foreground">{statistics.totalSessions}</div>
                        </div>
                    </div>
                </div>
            </div>
        </CollapsibleCard>
    );
}; 