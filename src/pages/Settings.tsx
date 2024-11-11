import { useState } from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { usePomodoroStore } from '@/stores/pomodoroStore';

const Settings = () => {
    const { settings, updateSettings } = usePomodoroStore();
    const [theme, setTheme] = useState('dark');
    const [autoSave, setAutoSave] = useState(true);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6 text-white">Settings</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#232430] p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4 text-white">Appearance</h2>
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <Label className="text-white">Theme</Label>
                            <Select value={theme} onValueChange={setTheme}>
                                <SelectTrigger className="w-[180px] bg-[#383844] border-[#4e4e59] text-white">
                                    <SelectValue placeholder="Select theme" />
                                </SelectTrigger>
                                <SelectContent className="bg-[#383844] border-[#4e4e59]">
                                    <SelectItem value="light" className="text-white hover:bg-[#4e4e59]">Light</SelectItem>
                                    <SelectItem value="dark" className="text-white hover:bg-[#4e4e59]">Dark</SelectItem>
                                    <SelectItem value="system" className="text-white hover:bg-[#4e4e59]">System</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                <div className="bg-[#232430] p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4 text-white">Editor</h2>
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <Label className="text-white">Auto-save</Label>
                                <p className="text-sm text-[#95959c]">Automatically save changes while editing</p>
                            </div>
                            <Switch
                                checked={autoSave}
                                onCheckedChange={setAutoSave}
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-[#232430] p-6 rounded-lg shadow col-span-2">
                    <h2 className="text-xl font-semibold mb-4 text-white">Pomodoro Timer</h2>
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="text-white">Work Duration (minutes)</Label>
                                <Input
                                    type="number"
                                    value={settings.workDuration}
                                    onChange={(e) => updateSettings({ workDuration: Number(e.target.value) })}
                                    className="bg-[#383844] border-[#4e4e59] text-white"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-white">Break Duration (minutes)</Label>
                                <Input
                                    type="number"
                                    value={settings.breakDuration}
                                    onChange={(e) => updateSettings({ breakDuration: Number(e.target.value) })}
                                    className="bg-[#383844] border-[#4e4e59] text-white"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-white">Long Break Duration (minutes)</Label>
                                <Input
                                    type="number"
                                    value={settings.longBreakDuration}
                                    onChange={(e) => updateSettings({ longBreakDuration: Number(e.target.value) })}
                                    className="bg-[#383844] border-[#4e4e59] text-white"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-white">Sessions Until Long Break</Label>
                                <Input
                                    type="number"
                                    value={settings.sessionsUntilLongBreak}
                                    onChange={(e) => updateSettings({ sessionsUntilLongBreak: Number(e.target.value) })}
                                    className="bg-[#383844] border-[#4e4e59] text-white"
                                />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <Label className="text-white">Auto-start Breaks</Label>
                                    <p className="text-sm text-[#95959c]">Automatically start break timer after work session</p>
                                </div>
                                <Switch
                                    checked={settings.autoStartBreaks}
                                    onCheckedChange={(checked) => updateSettings({ autoStartBreaks: checked })}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <Label className="text-white">Auto-start Work Sessions</Label>
                                    <p className="text-sm text-[#95959c]">Automatically start next work session after break</p>
                                </div>
                                <Switch
                                    checked={settings.autoStartPomodoros}
                                    onCheckedChange={(checked) => updateSettings({ autoStartPomodoros: checked })}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <Label className="text-white">Notifications</Label>
                                    <p className="text-sm text-[#95959c]">Show notifications when timer ends</p>
                                </div>
                                <Switch
                                    checked={settings.notifications}
                                    onCheckedChange={(checked) => updateSettings({ notifications: checked })}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;