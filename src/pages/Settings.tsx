import { useState } from 'react';
import { useSettingsStore } from '@/stores/settingsStore';
import { usePomodoroStore } from '@/stores/pomodoroStore';
import { AppearanceSettings, PomodoroSettings, ResetData } from '@/components/settings';
const Settings = () => {
    const settings = useSettingsStore();
    const pomodoroSettings = usePomodoroStore();
    const [localSettings, setLocalSettings] = useState({
        ...settings,
        ...pomodoroSettings.settings,
    });


    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">


                <div className="space-y-6 col-span-1">
                    <AppearanceSettings />
                    <ResetData />
                </div>

                <PomodoroSettings settings={localSettings} onChange={setLocalSettings} />

            </div>
        </div>
    );
};

export default Settings;