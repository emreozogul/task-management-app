import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Paintbrush } from 'lucide-react';
import { usePomodoroStore } from '@/stores/pomodoroStore';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface TimerTheme {
    name: string;
    timerColor: string;
    progressColor: string;
    textColor: string;
    previewColor?: string;
}

const defaultTimerTheme: TimerTheme = {
    name: "Default",
    timerColor: '#6775bc',
    progressColor: '#6775bc',
    textColor: '#6775bc',
    previewColor: '#6775bc'
};

const timerThemes: TimerTheme[] = [
    defaultTimerTheme,
    {
        name: 'Ocean',
        timerColor: '#0891b2',
        progressColor: '#0ea5e9',
        textColor: '#0ea5e9',
        previewColor: '#0ea5e9'
    },
    {
        name: 'Forest',
        timerColor: '#059669',
        progressColor: '#10b981',
        textColor: '#10b981',
        previewColor: '#10b981'
    },
    {
        name: 'Sunset',
        timerColor: '#f59e0b',
        progressColor: '#f97316',
        textColor: '#f97316',
        previewColor: '#f97316'
    }
];

export const ThemeSelector = () => {
    const { settings, updateSettings } = usePomodoroStore();
    const [selectedTheme, setSelectedTheme] = useState(settings.timerTheme?.name || defaultTimerTheme.name);

    const handleThemeChange = (themeName: string) => {
        const theme = timerThemes.find(t => t.name === themeName);
        if (theme) {
            setSelectedTheme(themeName);
            const { previewColor, ...themeToUpdate } = theme;
            updateSettings({
                timerTheme: themeToUpdate
            });
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Paintbrush className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md bg-background shadow-lg" onClick={(e) => e.stopPropagation()}>
                <DialogHeader>
                    <DialogTitle>Timer Theme</DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-4 py-4">
                    {timerThemes.map((theme) => (
                        <Button
                            key={theme.name}
                            variant="outline"
                            className={cn(
                                "h-auto py-4 flex flex-col gap-2",
                                selectedTheme === theme.name && "border-primary"
                            )}
                            onClick={() => handleThemeChange(theme.name)}
                        >
                            <div className="flex gap-2">
                                <div
                                    className="w-4 h-4 rounded-full"
                                    style={{ backgroundColor: theme.previewColor || theme.timerColor }}
                                />
                                <div
                                    className="w-4 h-4 rounded-full"
                                    style={{ backgroundColor: theme.previewColor || theme.progressColor }}
                                />
                            </div>
                            <span className="text-sm">{theme.name}</span>
                        </Button>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
}; 