import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PomodoroSession {
    taskId: string | null;
    startTime: Date;
    endTime: Date;
    duration: number;
    type: 'work' | 'break';
    completed: boolean;
}

interface PomodoroSettings {
    workDuration: number;
    breakDuration: number;
    longBreakDuration: number;
    sessionsUntilLongBreak: number;
    autoStartBreaks: boolean;
    autoStartPomodoros: boolean;
    notifications: boolean;
}

interface PomodoroState {
    isRunning: boolean;
    timeLeft: number;
    isWorkSession: boolean;
    sessionCount: number;
    settings: PomodoroSettings;
    activeTaskId: string | null;
    sessions: PomodoroSession[];
    statistics: {
        totalWorkTime: number;
        totalSessions: number;
        completedTasks: number;
    };

    // Actions
    updateSettings: (settings: Partial<PomodoroSettings>) => void;
    startTimer: () => void;
    pauseTimer: () => void;
    resetTimer: () => void;
    setActiveTask: (taskId: string | null) => void;
    completeSession: () => void;
    getTaskStatistics: (taskId: string) => {
        totalTime: number;
        completedSessions: number;
    };
}

export const usePomodoroStore = create<PomodoroState>()(
    persist(
        (set, get) => ({
            isRunning: false,
            timeLeft: 25 * 60,
            isWorkSession: true,
            sessionCount: 0,
            activeTaskId: null,
            sessions: [],
            statistics: {
                totalWorkTime: 0,
                totalSessions: 0,
                completedTasks: 0,
            },
            settings: {
                workDuration: 25,
                breakDuration: 5,
                longBreakDuration: 15,
                sessionsUntilLongBreak: 4,
                autoStartBreaks: true,
                autoStartPomodoros: false,
                notifications: true,
            },

            updateSettings: (newSettings) => {
                set((state) => ({
                    settings: { ...state.settings, ...newSettings },
                }));
            },

            startTimer: () => set({ isRunning: true }),
            pauseTimer: () => set({ isRunning: false }),

            resetTimer: () => {
                const { settings } = get();
                set({
                    isRunning: false,
                    timeLeft: settings.workDuration * 60,
                    isWorkSession: true,
                });
            },

            setActiveTask: (taskId) => set({ activeTaskId: taskId }),

            completeSession: () => {
                const state = get();
                const newSession: PomodoroSession = {
                    taskId: state.activeTaskId,
                    startTime: new Date(Date.now() - state.timeLeft * 1000),
                    endTime: new Date(),
                    duration: state.settings.workDuration * 60 - state.timeLeft,
                    type: state.isWorkSession ? 'work' : 'break',
                    completed: true,
                };

                set((state) => ({
                    sessions: [...state.sessions, newSession],
                    statistics: {
                        totalWorkTime: state.statistics.totalWorkTime + newSession.duration,
                        totalSessions: state.statistics.totalSessions + 1,
                        completedTasks: state.statistics.completedTasks + (newSession.taskId ? 1 : 0),
                    },
                }));
            },

            getTaskStatistics: (taskId) => {
                const state = get();
                const taskSessions = state.sessions.filter(
                    (session) => session.taskId === taskId && session.type === 'work'
                );
                return {
                    totalTime: taskSessions.reduce((acc, session) => acc + session.duration, 0),
                    completedSessions: taskSessions.length,
                };
            },
        }),
        {
            name: 'pomodoro-store',
        }
    )
); 