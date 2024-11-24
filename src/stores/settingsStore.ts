import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
    // Appearance
    theme: 'light' | 'dark' | 'system';

    // Editor
    autoSave: boolean;

    // Project
    defaultView: 'board' | 'calendar' | 'list';
    showCompletedTasks: boolean;
    enableTimeTracking: boolean;
    defaultTaskDuration: number;

    // View
    compactView: boolean;
    showTaskCount: boolean;
    enableQuickAdd: boolean;

    // Calendar
    defaultCalendarView: 'month' | 'week' | 'day';
    showWeekends: boolean;
    firstDayOfWeek: number;

    // Actions
    updateSettings: (settings: Partial<SettingsState>) => void;
}

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set) => ({
            // Default values
            theme: 'dark',
            autoSave: true,
            defaultView: 'board',
            showCompletedTasks: true,
            enableTimeTracking: false,
            defaultTaskDuration: 30,
            compactView: false,
            showTaskCount: true,
            enableQuickAdd: true,
            defaultCalendarView: 'week',
            showWeekends: true,
            firstDayOfWeek: 0,

            updateSettings: (newSettings) => set((state) => ({
                ...state,
                ...newSettings,
            })),
        }),
        {
            name: 'settings-storage',
        }
    )
);