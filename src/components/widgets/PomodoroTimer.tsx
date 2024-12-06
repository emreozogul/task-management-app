import { usePomodoroStore } from '@/stores/pomodoroStore';
import { Button } from '@/components/ui/button';
import { Timer, Pause, Play, RotateCcw, BarChart2 } from 'lucide-react';
import { CircularProgress } from '@/components/ui/circular-progress';
import { ThemeSelector } from './ThemeSelector';
import { NotificationSettings } from './NotificationSettings';
import { TaskSelector } from './TaskSelector';
import { PomodoroStats } from './PomodoroStats';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useMemo } from 'react';
import { CollapsibleCard } from '../ui/collapsible-card';
import { PomodoroSettings } from './PomodoroSettings';
export const PomodoroTimer = () => {
    const {
        timeLeft,
        isRunning,
        isWorkSession,
        isFocusMode,
        settings,
        startTimer,
        pauseTimer,
        resetTimer,
    } = usePomodoroStore();

    const timerTheme = settings.timerTheme;

    // Calculate progress percentage
    const progress = useMemo(() => {
        const totalSeconds = isWorkSession ? settings.workDuration * 60 : settings.breakDuration * 60;
        return ((totalSeconds - timeLeft) / totalSeconds) * 100;
    }, [timeLeft, isWorkSession, settings.workDuration, settings.breakDuration]);

    // Determine current phase
    const currentPhase = useMemo(() => {
        return isWorkSession ? 'Focus Time' : 'Break Time';
    }, [isWorkSession]);

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const toggleTimer = () => {
        if (isRunning) {
            pauseTimer();
        } else {
            startTimer();
        }
    };

    return (
        <CollapsibleCard className={cn(
            "relative overflow-hidden transition-all duration-500 h-full",
            isFocusMode ? " border-none shadow-2xl" : " border-none shadow-lg"
        )}
            title="Pomodoro Timer"
            icon={<Timer className="w-5 h-5 mr-2 text-primary" />}
            headerContent={
                <div className="flex items-center gap-4">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <BarChart2 className="h-4 w-4" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md bg-background">
                            <DialogHeader>
                                <DialogTitle>Pomodoro Statistics</DialogTitle>
                            </DialogHeader>
                            <PomodoroStats />
                        </DialogContent>
                    </Dialog>
                    <ThemeSelector />
                    <NotificationSettings />
                    <PomodoroSettings />
                </div>
            }
        >

            <div className={cn(
                "flex items-center transition-all duration-500 ",
                isFocusMode ? "justify-center " : "justify-between"
            )}>
                {/* Left side - Timer */}
                <div className={cn(
                    "flex flex-col items-center transition-all duration-500",
                    isFocusMode ? "w-full" : "w-1/2 pl-2"
                )}>
                    <CircularProgress
                        value={progress}
                        size={isFocusMode ? 300 : 240}
                        strokeWidth={isFocusMode ? 12 : 8}
                        color={timerTheme?.progressColor || 'var(--primary)'}
                        trackColor={timerTheme?.timerColor || 'var(--primary)'}
                        className="my-8"
                    >
                        <div className="flex flex-col items-center text-center">
                            <span
                                className={cn(
                                    "font-bold transition-all duration-500",
                                    isFocusMode ? "text-6xl" : "text-4xl"
                                )}
                                style={{
                                    color: timerTheme?.textColor || 'var(--primary-foreground)'
                                }}
                            >
                                {formatTime(timeLeft)}
                            </span>
                            <span
                                className="text-sm mt-2"
                                style={{
                                    color: timerTheme?.textColor || 'var(--primary-foreground)'
                                }}
                            >
                                {currentPhase}
                            </span>
                        </div>
                    </CircularProgress>

                    {/* Timer Controls */}
                    <div className="flex items-center gap-4 mb-2">
                        <Button
                            variant={isRunning ? "outline" : "default"}
                            size="icon"
                            onClick={toggleTimer}
                            className={cn(
                                "rounded-full transition-all duration-500",
                                isFocusMode ? "h-16 w-16" : "h-12 w-12",
                                isRunning ? "hover:bg-background-hover" : "bg-primary hover:bg-primary/90"
                            )}
                        >
                            {isRunning ?
                                <Pause className={cn(isFocusMode ? "h-6 w-6" : "h-4 w-4")} /> :
                                <Play className={cn(isFocusMode ? "h-6 w-6" : "h-4 w-4")} />
                            }
                        </Button>

                        <Button
                            variant="outline"
                            size="icon"
                            onClick={resetTimer}
                            className={cn(
                                "rounded-full hover:bg-background-hover transition-all duration-500",
                                isFocusMode ? "h-16 w-16" : "h-12 w-12"
                            )}
                        >
                            <RotateCcw className={cn(isFocusMode ? "h-6 w-6" : "h-4 w-4")} />
                        </Button>
                    </div>
                </div>

                {/* Right side - Task Selection */}
                {!isFocusMode && (
                    <div className="w-1/2 pr-2 flex h-full flex-col justify-start">
                        <div className="w-full">
                            <TaskSelector />
                        </div>
                    </div>
                )}
            </div>
        </CollapsibleCard>
    );
}; 