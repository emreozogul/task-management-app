import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, Clock, RotateCcw } from 'lucide-react';
import { CollapsibleCard } from '../ui/collapsible-card';
import { cn } from '@/lib/utils';

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
                        (Date.now() - prev.startTime!.getTime())
                    ),
                }));
            }, 10);
        }
        return () => clearInterval(interval);
    }, [state.isRunning, state.startTime]);

    const formatTimeSegments = (ms: number) => {
        const totalSeconds = Math.floor(ms / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        const milliseconds = ms % 1000;

        return {
            hours: hours.toString().padStart(2, '0'),
            minutes: minutes.toString().padStart(2, '0'),
            seconds: seconds.toString().padStart(2, '0'),
            milliseconds: Math.floor(milliseconds / 10).toString().padStart(2, '0')
        };
    };

    const formatTime = (ms: number): string => {
        const time = formatTimeSegments(ms);
        return `${time.hours}:${time.minutes}:${time.seconds}.${time.milliseconds}`;
    };

    const TimeSegment = ({ value }: { value: string }) => (
        <div className="bg-black/90 rounded-md px-2 py-1 min-w-[2.5ch] inline-flex justify-center">
            {value.split('').map((digit, idx) => (
                <span key={idx} className="text-green-400 font-mono text-3xl font-bold">
                    {digit}
                </span>
            ))}
        </div>
    );

    const Separator = () => (
        <div className="flex flex-col justify-center px-1">
            <div className={cn(
                "w-1.5 h-1.5 rounded-full mb-1",
                "bg-green-400",
                state.isRunning && "animate-pulse"
            )} />
            <div className={cn(
                "w-1.5 h-1.5 rounded-full",
                "bg-green-400",
                state.isRunning && "animate-pulse"
            )} />
        </div>
    );

    const toggleTimer = () => {
        setState(prev => ({
            ...prev,
            isRunning: !prev.isRunning,
            startTime: !prev.isRunning ? new Date() : prev.startTime,
        }));
    };

    const resetTimer = () => {
        setState({
            taskId: null,
            startTime: null,
            totalTime: 0,
            isRunning: false,
        });
    };

    const time = formatTimeSegments(state.totalTime);

    return (
        <CollapsibleCard title="Time Tracker" icon={<Clock className="w-5 h-5 mr-2 text-primary" />}>
            <div className="flex flex-col items-center p-6">
                <div className={cn(
                    "w-full max-w-md bg-background/80 backdrop-blur-sm rounded-xl p-8",
                    " shadow-lg",
                    "transition-all duration-300",
                    state.isRunning && "scale-102 border-primary/30"
                )}>
                    <div className="flex flex-col items-center space-y-6">
                        {/* Digital Display */}
                        <div className={cn(
                            "bg-black/5 rounded-xl p-6",
                            "border border-black/10",
                            "shadow-inner"
                        )}>
                            <div className="flex items-center justify-center gap-1">
                                <TimeSegment value={time.hours} />
                                <Separator />
                                <TimeSegment value={time.minutes} />
                                <Separator />
                                <TimeSegment value={time.seconds} />
                                <div className="text-green-400 font-mono text-3xl font-bold">.</div>
                                <TimeSegment value={time.milliseconds} />
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="flex gap-3">
                            <Button
                                onClick={toggleTimer}
                                className={cn(
                                    "transition-all duration-300 px-6",
                                    state.isRunning
                                        ? "bg-destructive hover:bg-destructive/90"
                                        : "bg-primary hover:bg-primary/90"
                                )}
                                size="lg"
                            >
                                {state.isRunning ? (
                                    <div className="flex items-center gap-2">
                                        <Pause className="w-5 h-5" />
                                        <span>Stop</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <Play className="w-5 h-5" />
                                        <span>Start</span>
                                    </div>
                                )}
                            </Button>

                            <Button
                                onClick={resetTimer}
                                variant="outline"
                                size="lg"
                                disabled={state.isRunning}
                                className="px-6"
                            >
                                <div className="flex items-center gap-2">
                                    <RotateCcw className="w-5 h-5" />
                                    <span>Reset</span>
                                </div>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </CollapsibleCard>
    );
}; 