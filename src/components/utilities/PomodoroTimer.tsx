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
            icon={<Timer className="w-5 h-5 mr-2 text-[#6775bc]" />}
            headerContent={settingsButton}
        >
            <div className="flex flex-col">
                <div className="text-4xl font-mono text-white text-center mb-6">
                    {formatTime(timeLeft)}
                </div>

                <div className="flex justify-center space-x-4 mb-6">
                    <Button
                        onClick={() => (isRunning ? pauseTimer() : startTimer())}
                        className="bg-[#6775bc] hover:bg-[#7983c4]"
                    >
                        {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </Button>
                    <Button
                        onClick={resetTimer}
                        variant="outline"
                        className="border-[#383844] text-white hover:bg-[#383844]"
                    >
                        <RotateCcw className="w-4 h-4" />
                    </Button>
                </div>

                <div className="border-t border-[#383844] pt-4">
                    <h3 className="text-sm font-medium text-white mb-2">Statistics</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <div className="text-[#95959c]">Total Focus Time</div>
                            <div className="text-white">{formatDuration(statistics.totalWorkTime)}</div>
                        </div>
                        <div>
                            <div className="text-[#95959c]">Completed Sessions</div>
                            <div className="text-white">{statistics.totalSessions}</div>
                        </div>
                    </div>
                </div>
            </div>
        </CollapsibleCard>
    );
}; 