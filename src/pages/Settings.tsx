import { useState } from 'react';
import { useSettingsStore } from '@/stores/settingsStore';
import { usePomodoroStore } from '@/stores/pomodoroStore';
import { AppearanceSettings, EditorSettings, ProjectSettings, PomodoroSettings, ResetData } from '@/components/settings';
const Settings = () => {
    const settings = useSettingsStore();
    const pomodoroSettings = usePomodoroStore();
    const [localSettings, setLocalSettings] = useState({
        ...settings,
        ...pomodoroSettings.settings,
    });


    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                    <AppearanceSettings />
                    <EditorSettings settings={localSettings} onChange={setLocalSettings} />
                    <ProjectSettings settings={localSettings} onChange={setLocalSettings} />
                </div>
                <div className="space-y-6">
                    <PomodoroSettings settings={localSettings} onChange={setLocalSettings} />
                    <ResetData />
                </div>
            </div>
        </div>
    );
};

export default Settings;