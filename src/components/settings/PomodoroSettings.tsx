import { SettingsCard } from './SettingsCard';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';

interface PomodoroSettingsProps {
    settings: any;
    onChange: (settings: any) => void;
}

export const PomodoroSettings = ({ settings, onChange }: PomodoroSettingsProps) => {
    return (
        <SettingsCard
            title="Pomodoro Timer"
            description="Customize your Pomodoro timer settings"
        >
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Work Duration (minutes)</Label>
                        <Input
                            type="number"
                            value={settings.workDuration}
                            onChange={(e) => onChange({
                                ...settings,
                                workDuration: parseInt(e.target.value)
                            })}
                            className="bg-[#383844] border-[#4e4e59]"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Break Duration (minutes)</Label>
                        <Input
                            type="number"
                            value={settings.breakDuration}
                            onChange={(e) => onChange({
                                ...settings,
                                breakDuration: parseInt(e.target.value)
                            })}
                            className="bg-[#383844] border-[#4e4e59]"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Long Break Duration (minutes)</Label>
                    <Input
                        type="number"
                        value={settings.longBreakDuration}
                        onChange={(e) => onChange({
                            ...settings,
                            longBreakDuration: parseInt(e.target.value)
                        })}
                        className="bg-[#383844] border-[#4e4e59]"
                    />
                </div>

                <div className="flex items-center justify-between">
                    <Label>Auto-start Breaks</Label>
                    <Switch
                        checked={settings.autoStartBreaks}
                        onCheckedChange={(checked) => onChange({
                            ...settings,
                            autoStartBreaks: checked
                        })}
                    />
                </div>

                <div className="flex items-center justify-between">
                    <Label>Auto-start Pomodoros</Label>
                    <Switch
                        checked={settings.autoStartPomodoros}
                        onCheckedChange={(checked) => onChange({
                            ...settings,
                            autoStartPomodoros: checked
                        })}
                    />
                </div>

                <div className="flex items-center justify-between">
                    <Label>Notifications</Label>
                    <Switch
                        checked={settings.notifications}
                        onCheckedChange={(checked) => onChange({
                            ...settings,
                            notifications: checked
                        })}
                    />
                </div>
            </div>
        </SettingsCard>
    );
};