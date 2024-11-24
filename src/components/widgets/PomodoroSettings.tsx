import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Settings } from 'lucide-react';
import { usePomodoroStore } from '@/stores/pomodoroStore';
import { useDialogKeyboard } from '@/hooks/useDialogKeyboard';

export const PomodoroSettings = () => {
    const { settings, updateSettings } = usePomodoroStore();
    const [isOpen, setIsOpen] = useState(false);
    const [localSettings, setLocalSettings] = useState(settings);

    // Reset local settings when dialog opens
    useEffect(() => {
        if (isOpen) {
            setLocalSettings(settings);
        }
    }, [isOpen, settings]);

    const handleSave = () => {
        updateSettings(localSettings);
        setIsOpen(false);
    };

    const handleCancel = () => {
        setLocalSettings(settings);
        setIsOpen(false);
    };

    useDialogKeyboard({
        isOpen,
        onClose: handleCancel,
        onSubmit: handleSave
    });

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="icon" className="border-border hover:bg-background-hover">
                    <Settings className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-background-secondary border-border text-primary-foreground">
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold text-primary-foreground">Timer Settings</DialogTitle>
                    <DialogDescription className="text-sm text-muted">
                        Customize your Pomodoro timer settings.
                    </DialogDescription>
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
                                className="bg-background-hover border-border"
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
                                className="bg-background-hover border-border"
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
                            className="bg-background-hover border-border"
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
                </div>
                <DialogFooter className="mt-4">
                    <Button
                        variant="ghost"
                        onClick={handleCancel}
                        className="border-border text-primary-foreground hover:bg-background-hover"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        className="bg-primary hover:bg-primary-hover text-primary-foreground"
                    >
                        Save Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}; 