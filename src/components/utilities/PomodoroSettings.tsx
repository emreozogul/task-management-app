import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Settings } from 'lucide-react';
import { usePomodoroStore } from '@/stores/pomodoroStore';

export const PomodoroSettings = () => {
    const { settings, updateSettings } = usePomodoroStore();
    const [localSettings, setLocalSettings] = useState(settings);

    const handleSave = () => {
        updateSettings(localSettings);
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="icon" className="border-[#383844] hover:bg-[#383844]">
                    <Settings className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#232430] border-[#383844] text-white">
                <DialogHeader>
                    <DialogTitle>Timer Settings</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Work Duration (minutes)</Label>
                            <Input
                                type="number"
                                value={localSettings.workDuration}
                                onChange={(e) =>
                                    setLocalSettings({
                                        ...localSettings,
                                        workDuration: parseInt(e.target.value),
                                    })
                                }
                                className="bg-[#383844] border-[#4e4e59]"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Break Duration (minutes)</Label>
                            <Input
                                type="number"
                                value={localSettings.breakDuration}
                                onChange={(e) =>
                                    setLocalSettings({
                                        ...localSettings,
                                        breakDuration: parseInt(e.target.value),
                                    })
                                }
                                className="bg-[#383844] border-[#4e4e59]"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Long Break Duration (minutes)</Label>
                        <Input
                            type="number"
                            value={localSettings.longBreakDuration}
                            onChange={(e) =>
                                setLocalSettings({
                                    ...localSettings,
                                    longBreakDuration: parseInt(e.target.value),
                                })
                            }
                            className="bg-[#383844] border-[#4e4e59]"
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <Label>Auto-start Breaks</Label>
                        <Switch
                            checked={localSettings.autoStartBreaks}
                            onCheckedChange={(checked) =>
                                setLocalSettings({
                                    ...localSettings,
                                    autoStartBreaks: checked,
                                })
                            }
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <Label>Auto-start Pomodoros</Label>
                        <Switch
                            checked={localSettings.autoStartPomodoros}
                            onCheckedChange={(checked) =>
                                setLocalSettings({
                                    ...localSettings,
                                    autoStartPomodoros: checked,
                                })
                            }
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <Label>Notifications</Label>
                        <Switch
                            checked={localSettings.notifications}
                            onCheckedChange={(checked) =>
                                setLocalSettings({
                                    ...localSettings,
                                    notifications: checked,
                                })
                            }
                        />
                    </div>

                    <Button
                        onClick={handleSave}
                        className="w-full bg-[#6775bc] hover:bg-[#7983c4]"
                    >
                        Save Settings
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}; 