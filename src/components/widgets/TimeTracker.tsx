import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, Clock } from 'lucide-react';
import { CollapsibleCard } from '../ui/collapsible-card';

interface TimeTrackerState {
    taskId: string | null;
    startTime: Date | null;
    totalTime: number;
    isRunning: boolean;
}

export const TimeTracker = () => {
    const [state, setState] = useState<TimeTrackerState>({
        taskId: null,
        startTime: null,
        totalTime: 0,
        isRunning: false,
    });

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (state.isRunning && state.startTime) {
            interval = setInterval(() => {
                setState(prev => ({
                    ...prev,
                    totalTime: Math.floor(
                        (Date.now() - prev.startTime!.getTime()) / 1000
                    ),
                }));
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [state.isRunning, state.startTime]);

    const formatTime = (seconds: number): string => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hours}h ${minutes}m ${secs}s`;
    };

    const toggleTimer = () => {
        setState(prev => ({
            ...prev,
            isRunning: !prev.isRunning,
            startTime: !prev.isRunning ? new Date() : prev.startTime,
        }));
    };

    return (
        <CollapsibleCard title="Time Tracker" icon={<Clock className="w-5 h-5 mr-2 text-primary" />}>
            <div className="text-3xl font-mono text-primary-foreground text-center mb-6">
                {formatTime(state.totalTime)}
            </div>

            <div className="flex justify-center">
                <Button
                    onClick={toggleTimer}
                    className="bg-primary hover:bg-primary-hover"
                >
                    {state.isRunning ?
                        <Pause className="w-4 h-4" /> :
                        <Play className="w-4 h-4" />
                    }
                </Button>
            </div>
        </CollapsibleCard>
    );
}; 