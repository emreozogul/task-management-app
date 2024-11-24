import { useState, useEffect } from 'react';
import { useSettingsStore } from '@/stores/settingsStore';
import { usePomodoroStore } from '@/stores/pomodoroStore';
import { AppearanceSettings, EditorSettings, ProjectSettings, PomodoroSettings, ViewSettings } from '@/components/settings';
import { Button } from '@/components/ui/button';

const Settings = () => {
    const settings = useSettingsStore();
    const pomodoroSettings = usePomodoroStore();
    const [hasChanges, setHasChanges] = useState(false);
    const [localSettings, setLocalSettings] = useState({
        ...settings,
        ...pomodoroSettings.settings,
    });

    useEffect(() => {
        const hasSettingsChanged = JSON.stringify(localSettings) !==
            JSON.stringify({ ...settings, ...pomodoroSettings.settings });
        setHasChanges(hasSettingsChanged);
    }, [localSettings, settings, pomodoroSettings.settings]);

    const handleSave = () => {
        settings.updateSettings(localSettings);
        pomodoroSettings.updateSettings({
            workDuration: localSettings.workDuration,
            breakDuration: localSettings.breakDuration,
            longBreakDuration: localSettings.longBreakDuration,
            autoStartBreaks: localSettings.autoStartBreaks,
            autoStartPomodoros: localSettings.autoStartPomodoros,
            notifications: localSettings.notifications,
        });
        setHasChanges(false);
    };

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-semibold text-primary-foreground">Settings</h1>
                <Button
                    onClick={handleSave}
                    disabled={!hasChanges}
                    className="bg-primary hover:bg-primary-hover text-primary-foreground"
                >
                    Save Changes
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                    <AppearanceSettings />
                    <EditorSettings settings={localSettings} onChange={setLocalSettings} />
                    <ProjectSettings settings={localSettings} onChange={setLocalSettings} />
                </div>
                <div className="space-y-6">
                    <PomodoroSettings settings={localSettings} onChange={setLocalSettings} />
                    <ViewSettings settings={localSettings} onChange={setLocalSettings} />
                </div>
            </div>
        </div>
    );
};

export default Settings;