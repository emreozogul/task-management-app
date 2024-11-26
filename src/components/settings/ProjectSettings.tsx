import { SettingsCard } from './SettingsCard';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface ProjectSettingsProps {
    settings: any;
    onChange: (settings: any) => void;
}

export const ProjectSettings = ({ settings, onChange }: ProjectSettingsProps) => {
    return (
        <SettingsCard
            title="Project Settings"
            description="Configure project-wide preferences"
        >
            <div className="space-y-4 text-primary-foreground">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <Label>Default View</Label>
                        <p className="text-sm text-muted">Choose default project view</p>
                    </div>
                    <Select
                        value={settings.defaultView}
                        onValueChange={(value) => onChange({ ...settings, defaultView: value })}
                    >
                        <SelectTrigger className="w-[180px] bg-background-hover border-border">
                            <SelectValue placeholder="Select view" />
                        </SelectTrigger>
                        <SelectContent className="bg-background-secondary border-border">
                            <SelectItem value="board" className="text-primary-foreground hover:bg-background-hover">Board</SelectItem>
                            <SelectItem value="calendar" className="text-primary-foreground hover:bg-background-hover">Calendar</SelectItem>
                            <SelectItem value="list" className="text-primary-foreground hover:bg-background-hover">List</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <Label>Show Completed Tasks</Label>
                        <p className="text-sm text-muted">Display completed tasks in views</p>
                    </div>
                    <Switch
                        checked={settings.showCompletedTasks}
                        onCheckedChange={(checked) => onChange({ ...settings, showCompletedTasks: checked })}
                    />
                </div>

                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <Label>Time Tracking</Label>
                        <p className="text-sm text-muted-foreground">Enable time tracking for tasks</p>
                    </div>
                    <Switch
                        checked={settings.enableTimeTracking}
                        onCheckedChange={(checked) => onChange({ ...settings, enableTimeTracking: checked })}
                    />
                </div>
            </div>
        </SettingsCard>
    );
};