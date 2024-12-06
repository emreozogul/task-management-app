import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bell, Volume2 } from 'lucide-react';
import { usePomodoroStore } from '@/stores/pomodoroStore';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const soundOptions = [
    { value: 'bell', label: 'Bell' },
    { value: 'chime', label: 'Chime' },
    { value: 'digital', label: 'Digital' },
];

export const NotificationSettings = () => {
    const { settings, updateNotifications } = usePomodoroStore();
    const [isTestingSound, setIsTestingSound] = useState<string | null>(null);

    const handleSoundTest = (type: 'work' | 'break' | 'longBreak') => {
        setIsTestingSound(type);
        const sound = settings.notifications[`${type}Sound`];
        // Play the sound
        setTimeout(() => setIsTestingSound(null), 1000);
    };

    return (
        <Dialog>
            <DialogTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Bell className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md bg-background shadow-lg" onClick={(e) => e.stopPropagation()}>
                <DialogHeader>
                    <DialogTitle>Notification Settings</DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Sound Settings */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label>Enable Sounds</Label>
                            <Switch
                                checked={settings.notifications.sound}
                                onCheckedChange={(checked) =>
                                    updateNotifications({ sound: checked })}
                            />
                        </div>

                        {settings.notifications.sound && (
                            <>
                                <div className="space-y-2">
                                    <Label className="text-sm">Volume</Label>
                                    <div className="flex items-center gap-2">
                                        <Volume2 className="h-4 w-4" />
                                        <Slider
                                            value={[settings.notifications.volume * 100]}
                                            onValueChange={([value]) =>
                                                updateNotifications({ volume: value / 100 })}
                                            max={100}
                                            step={1}
                                        />
                                        <span className="min-w-[3ch] text-sm">
                                            {Math.round(settings.notifications.volume * 100)}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-sm">Work Sound</Label>
                                            <div className="flex gap-2">
                                                <Select
                                                    value={settings.notifications.workSound}
                                                    onValueChange={(value: any) =>
                                                        updateNotifications({ workSound: value })}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {soundOptions.map(option => (
                                                            <SelectItem
                                                                key={option.value}
                                                                value={option.value}
                                                            >
                                                                {option.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() => handleSoundTest('work')}
                                                    disabled={isTestingSound !== null}
                                                >
                                                    {isTestingSound === 'work' ? '...' : '▶'}
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-sm">Break Sound</Label>
                                            <div className="flex gap-2">
                                                <Select
                                                    value={settings.notifications.breakSound}
                                                    onValueChange={(value: any) =>
                                                        updateNotifications({ breakSound: value })}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {soundOptions.map(option => (
                                                            <SelectItem
                                                                key={option.value}
                                                                value={option.value}
                                                            >
                                                                {option.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() => handleSoundTest('break')}
                                                    disabled={isTestingSound !== null}
                                                >
                                                    {isTestingSound === 'break' ? '...' : '▶'}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-sm">Long Break Sound</Label>
                                        <div className="flex gap-2">
                                            <Select
                                                value={settings.notifications.longBreakSound}
                                                onValueChange={(value: any) =>
                                                    updateNotifications({ longBreakSound: value })}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {soundOptions.map(option => (
                                                        <SelectItem
                                                            key={option.value}
                                                            value={option.value}
                                                        >
                                                            {option.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => handleSoundTest('longBreak')}
                                                disabled={isTestingSound !== null}
                                            >
                                                {isTestingSound === 'longBreak' ? '...' : '▶'}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Browser Notifications */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label>Browser Notifications</Label>
                            <Switch
                                checked={settings.notifications.browser}
                                onCheckedChange={(checked) => {
                                    if (checked) {
                                        Notification.requestPermission().then((permission) => {
                                            if (permission === 'granted') {
                                                updateNotifications({ browser: true });
                                            }
                                        });
                                    } else {
                                        updateNotifications({ browser: false });
                                    }
                                }}
                            />
                        </div>

                        {settings.notifications.browser && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <Label className="text-sm">Notify Before End</Label>
                                    <Switch
                                        checked={settings.notifications.notifyBeforeEnd}
                                        onCheckedChange={(checked) =>
                                            updateNotifications({ notifyBeforeEnd: checked })}
                                    />
                                </div>

                                {settings.notifications.notifyBeforeEnd && (
                                    <div className="space-y-2">
                                        <Label className="text-sm">Notification Time (minutes)</Label>
                                        <Slider
                                            value={[settings.notifications.notifyBeforeEndMinutes]}
                                            onValueChange={([value]) =>
                                                updateNotifications({ notifyBeforeEndMinutes: value })}
                                            min={1}
                                            max={5}
                                            step={1}
                                        />
                                        <div className="text-sm text-muted-foreground text-right">
                                            {settings.notifications.notifyBeforeEndMinutes} minute(s) before end
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}; 