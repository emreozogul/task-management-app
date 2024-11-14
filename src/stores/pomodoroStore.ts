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
    lastTickTime: number | null;
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
    tick: () => void;
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
            lastTickTime: null,
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

            tick: () => {
                const state = get();
                const now = Date.now();

                if (!state.isRunning || !state.lastTickTime) return;

                const deltaTime = Math.floor((now - state.lastTickTime) / 1000);
                if (deltaTime >= 1) {
                    set((state) => ({
                        timeLeft: Math.max(0, state.timeLeft - deltaTime),
                        lastTickTime: now,
                    }));

                    // Check if timer completed
                    if (state.timeLeft <= deltaTime) {
                        get().completeSession();
                    }
                }
            },

            startTimer: () => set((state) => ({
                isRunning: true,
                lastTickTime: Date.now()
            })),

            pauseTimer: () => set({ isRunning: false, lastTickTime: null }),

            resetTimer: () => {
                const { settings } = get();
                set({
                    isRunning: false,
                    timeLeft: settings.workDuration * 60,
                    isWorkSession: true,
                    lastTickTime: null,
                });
            },

            updateSettings: (newSettings) => {
                set((state) => ({
                    settings: { ...state.settings, ...newSettings },
                }));
            },

            setActiveTask: (taskId) => set({ activeTaskId: taskId }),

            completeSession: () => {
                const state = get();
                const sessionDuration = state.isWorkSession
                    ? state.settings.workDuration * 60
                    : state.settings.breakDuration * 60;

                const newSession: PomodoroSession = {
                    taskId: state.activeTaskId,
                    startTime: new Date(Date.now() - sessionDuration * 1000),
                    endTime: new Date(),
                    duration: sessionDuration,
                    type: state.isWorkSession ? 'work' : 'break',
                    completed: true,
                };

                set((state) => ({
                    sessions: [...state.sessions, newSession],
                    statistics: {
                        ...state.statistics,
                        totalWorkTime: state.isWorkSession
                            ? state.statistics.totalWorkTime + sessionDuration
                            : state.statistics.totalWorkTime,
                        totalSessions: state.isWorkSession
                            ? state.statistics.totalSessions + 1
                            : state.statistics.totalSessions,
                        completedTasks: state.statistics.completedTasks + (newSession.taskId ? 1 : 0),
                    },
                    isWorkSession: !state.isWorkSession,
                    timeLeft: !state.isWorkSession
                        ? state.settings.workDuration * 60
                        : state.settings.breakDuration * 60,
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

// Add a global interval for the timer
let globalInterval: number | null = null;

// Start the global timer
function startGlobalTimer() {
    if (globalInterval) return;

    globalInterval = window.setInterval(() => {
        usePomodoroStore.getState().tick();
    }, 100); // Check more frequently for better accuracy
}

// Stop the global timer
function stopGlobalTimer() {
    if (globalInterval) {
        clearInterval(globalInterval);
        globalInterval = null;
    }
}

// Initialize the global timer
startGlobalTimer();

// Optional: Clean up on window unload
window.addEventListener('unload', stopGlobalTimer);

export { startGlobalTimer, stopGlobalTimer }; 