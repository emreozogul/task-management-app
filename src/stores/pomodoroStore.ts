import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { startOfDay, isToday, isSameDay, subDays } from 'date-fns';

interface PomodoroSession {
    taskId: string | null;
    startTime: Date;
    endTime: Date;
    duration: number;
    type: 'work' | 'break';
    completed: boolean;
}

interface DailyStats {
    date: string;
    sessionsCompleted: number;
    totalFocusTime: number;
    tasksCompleted: number;
}

interface ThemeSettings {
    primaryColor: string;
    accentColor: string;
    backgroundColor: string;
    textColor: string;
    isDark: boolean;
}

interface NotificationSettings {
    sound: boolean;
    browser: boolean;
    volume: number;
    workSound: 'bell' | 'chime' | 'digital';
    breakSound: 'bell' | 'chime' | 'digital';
    longBreakSound: 'bell' | 'chime' | 'digital';
    notifyBeforeEnd: boolean;
    notifyBeforeEndMinutes: number;
}

interface TimerTheme {
    name: string;
    timerColor: string;
    progressColor: string;
    textColor: string;
}

interface PomodoroSettings {
    workDuration: number;
    breakDuration: number;
    longBreakDuration: number;
    sessionsUntilLongBreak: number;
    autoStartBreaks: boolean;
    autoStartPomodoros: boolean;
    notifications: NotificationSettings;
    timerTheme: TimerTheme;
    dailyGoal: number;
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
    dailyStats: DailyStats[];
    currentStreak: number;
    longestStreak: number;
    isFocusMode: boolean;
    statistics: {
        totalWorkTime: number;
        totalSessions: number;
        completedTasks: number;
        bestDay: {
            date: string;
            sessions: number;
        } | null;
    };

    // Actions
    updateSettings: (settings: Partial<PomodoroSettings>) => void;
    updateTheme: (theme: Partial<ThemeSettings>) => void;
    updateNotifications: (notifications: Partial<NotificationSettings>) => void;
    startTimer: () => void;
    pauseTimer: () => void;
    resetTimer: () => void;
    skipBreak: () => void;
    extendSession: (minutes: number) => void;
    setActiveTask: (taskId: string | null) => void;
    completeSession: () => void;
    toggleFocusMode: () => void;
    tick: () => void;
    getTaskStatistics: (taskId: string) => {
        totalTime: number;
        completedSessions: number;
    };
    getDailyProgress: () => {
        completed: number;
        goal: number;
        percentage: number;
    };
    playSound: (type: 'work' | 'break' | 'longBreak') => void;
}

// Default timer theme
const defaultTimerTheme: TimerTheme = {
    name: "Default",
    timerColor: '#6775bc',
    progressColor: '#6775bc',
    textColor: '#ffffff',
};

// Default notification settings
const defaultNotifications: NotificationSettings = {
    sound: true,
    browser: true,
    volume: 0.5,
    workSound: 'bell',
    breakSound: 'chime',
    longBreakSound: 'digital',
    notifyBeforeEnd: true,
    notifyBeforeEndMinutes: 1,
};

// Sound effects for different notification types
const createSound = (type: 'bell' | 'chime' | 'digital'): AudioBuffer => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const sampleRate = audioContext.sampleRate;
    let duration = 0.2;
    let frequency = 800;

    switch (type) {
        case 'bell':
            frequency = 800;
            duration = 0.3;
            break;
        case 'chime':
            frequency = 600;
            duration = 0.2;
            break;
        case 'digital':
            frequency = 400;
            duration = 0.15;
            break;
    }

    const buffer = audioContext.createBuffer(1, duration * sampleRate, sampleRate);
    const channel = buffer.getChannelData(0);

    for (let i = 0; i < buffer.length; i++) {
        channel[i] = Math.sin(2 * Math.PI * frequency * i / sampleRate) *
            Math.exp(-5 * i / buffer.length);
    }

    return buffer;
};

// Sound playback utility
const playAudioBuffer = (buffer: AudioBuffer, volume: number = 0.5) => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const source = audioContext.createBufferSource();
    const gainNode = audioContext.createGain();

    source.buffer = buffer;
    gainNode.gain.value = volume;

    source.connect(gainNode);
    gainNode.connect(audioContext.destination);
    source.start();
};

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
            dailyStats: [],
            currentStreak: 0,
            longestStreak: 0,
            isFocusMode: false,
            statistics: {
                totalWorkTime: 0,
                totalSessions: 0,
                completedTasks: 0,
                bestDay: null,
            },
            settings: {
                workDuration: 25,
                breakDuration: 5,
                longBreakDuration: 15,
                sessionsUntilLongBreak: 4,
                autoStartBreaks: true,
                autoStartPomodoros: false,
                notifications: defaultNotifications,
                timerTheme: defaultTimerTheme,
                dailyGoal: 8,
            },

            playSound: (type) => {
                const state = get();
                const { notifications } = state.settings;
                if (!notifications.sound) return;

                const sound = createSound(notifications[`${type}Sound`]);
                playAudioBuffer(sound, notifications.volume);
            },

            getDailyProgress: () => {
                const state = get();
                const todaySessions = state.sessions.filter(session =>
                    isToday(new Date(session.endTime)) &&
                    session.type === 'work' &&
                    session.completed
                ).length;

                return {
                    completed: todaySessions,
                    goal: state.settings.dailyGoal,
                    percentage: (todaySessions / state.settings.dailyGoal) * 100
                };
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

            startTimer: () => {
                const state = get();
                if (state.settings.notifications) {
                    Notification.requestPermission();
                }
                set(() => ({
                    isRunning: true,
                    lastTickTime: Date.now(),
                    isFocusMode: true
                }));
            },

            pauseTimer: () => set(() => ({
                isRunning: false,
                lastTickTime: null,
                isFocusMode: false
            })),

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
                const isLongBreak = !state.isWorkSession &&
                    state.sessionCount > 0 &&
                    state.sessionCount % state.settings.sessionsUntilLongBreak === 0;

                const sessionDuration = state.isWorkSession
                    ? state.settings.workDuration * 60
                    : isLongBreak
                        ? state.settings.longBreakDuration * 60
                        : state.settings.breakDuration * 60;

                const newSession: PomodoroSession = {
                    taskId: state.activeTaskId,
                    startTime: new Date(Date.now() - sessionDuration * 1000),
                    endTime: new Date(),
                    duration: sessionDuration,
                    type: state.isWorkSession ? 'work' : 'break',
                    completed: true,
                };

                // Play sound and show notification
                if (state.settings.notifications.sound) {
                    state.playSound(isLongBreak ? 'longBreak' : state.isWorkSession ? 'work' : 'break');
                }

                if (state.settings.notifications) {
                    new Notification(
                        state.isWorkSession ? 'Break Time!' : 'Back to Work!',
                        {
                            body: state.isWorkSession
                                ? 'Great job! Take a break.'
                                : 'Break is over. Let\'s focus!',
                            icon: '/favicon.ico'
                        }
                    );
                }

                // Update daily stats
                const today = startOfDay(new Date()).toISOString();
                const dailyStatsIndex = state.dailyStats.findIndex(
                    stats => stats.date === today
                );

                let newDailyStats = [...state.dailyStats];
                if (dailyStatsIndex === -1) {
                    newDailyStats.push({
                        date: today,
                        sessionsCompleted: state.isWorkSession ? 1 : 0,
                        totalFocusTime: state.isWorkSession ? sessionDuration : 0,
                        tasksCompleted: newSession.taskId ? 1 : 0,
                    });
                } else {
                    newDailyStats[dailyStatsIndex] = {
                        ...newDailyStats[dailyStatsIndex],
                        sessionsCompleted: state.isWorkSession
                            ? newDailyStats[dailyStatsIndex].sessionsCompleted + 1
                            : newDailyStats[dailyStatsIndex].sessionsCompleted,
                        totalFocusTime: state.isWorkSession
                            ? newDailyStats[dailyStatsIndex].totalFocusTime + sessionDuration
                            : newDailyStats[dailyStatsIndex].totalFocusTime,
                        tasksCompleted: newSession.taskId
                            ? newDailyStats[dailyStatsIndex].tasksCompleted + 1
                            : newDailyStats[dailyStatsIndex].tasksCompleted,
                    };
                }

                // Calculate streak
                let streak = 0;
                let currentDate = new Date();
                for (let i = 0; i < newDailyStats.length; i++) {
                    const statsDate = new Date(newDailyStats[i].date);
                    if (isSameDay(currentDate, statsDate) ||
                        isSameDay(subDays(currentDate, 1), statsDate)) {
                        if (newDailyStats[i].sessionsCompleted >= state.settings.dailyGoal) {
                            streak++;
                            currentDate = statsDate;
                        } else {
                            break;
                        }
                    } else {
                        break;
                    }
                }

                // Find best day
                const bestDay = newDailyStats.reduce((best, current) => {
                    if (!best || current.sessionsCompleted > best.sessions) {
                        return {
                            date: current.date,
                            sessions: current.sessionsCompleted
                        };
                    }
                    return best;
                }, state.statistics.bestDay);

                set((state) => ({
                    sessions: [...state.sessions, newSession],
                    dailyStats: newDailyStats,
                    currentStreak: streak,
                    longestStreak: Math.max(streak, state.longestStreak),
                    statistics: {
                        ...state.statistics,
                        totalWorkTime: state.isWorkSession
                            ? state.statistics.totalWorkTime + sessionDuration
                            : state.statistics.totalWorkTime,
                        totalSessions: state.isWorkSession
                            ? state.statistics.totalSessions + 1
                            : state.statistics.totalSessions,
                        completedTasks: state.statistics.completedTasks + (newSession.taskId ? 1 : 0),
                        bestDay,
                    },
                    sessionCount: state.sessionCount + 1,
                    isWorkSession: !state.isWorkSession,
                    timeLeft: !state.isWorkSession
                        ? state.settings.workDuration * 60
                        : isLongBreak
                            ? state.settings.longBreakDuration * 60
                            : state.settings.breakDuration * 60,
                }));

                // Auto-start next session if enabled
                if ((state.isWorkSession && state.settings.autoStartBreaks) ||
                    (!state.isWorkSession && state.settings.autoStartPomodoros)) {
                    setTimeout(() => {
                        get().startTimer();
                    }, 1000);
                }
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

            updateTheme: (theme) => {
                set((state) => ({
                    settings: {
                        ...state.settings,
                        timerTheme: { ...state.settings.timerTheme, ...theme },
                    },
                }));
            },

            updateNotifications: (notifications) => {
                set((state) => ({
                    settings: {
                        ...state.settings,
                        notifications: { ...state.settings.notifications, ...notifications },
                    },
                }));
            },

            skipBreak: () => {
                const state = get();
                if (!state.isWorkSession) {
                    set({
                        isWorkSession: true,
                        timeLeft: state.settings.workDuration * 60,
                        isRunning: false,
                    });
                }
            },

            extendSession: (minutes) => {
                set((state) => ({
                    timeLeft: state.timeLeft + minutes * 60,
                }));
            },

            toggleFocusMode: () => {
                const state = get();
                if (!state.isFocusMode && !state.isRunning) {
                    state.startTimer();
                }
                set((state) => ({
                    isFocusMode: !state.isFocusMode,
                }));
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