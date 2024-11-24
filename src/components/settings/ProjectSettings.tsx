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
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <Label>Default View</Label>
                        <p className="text-sm text-[#95959c]">Choose default project view</p>
                    </div>
                    <Select
                        value={settings.defaultView}
                        onValueChange={(value) => onChange({ ...settings, defaultView: value })}
                    >
                        <SelectTrigger className="w-[180px] bg-[#383844] border-[#4e4e59]">
                            <SelectValue placeholder="Select view" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#383844] border-[#4e4e59]">
                            <SelectItem value="board" className="text-white hover:bg-[#4e4e59]">Board</SelectItem>
                            <SelectItem value="calendar" className="text-white hover:bg-[#4e4e59]">Calendar</SelectItem>
                            <SelectItem value="list" className="text-white hover:bg-[#4e4e59]">List</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <Label>Show Completed Tasks</Label>
                        <p className="text-sm text-muted-foreground">Display completed tasks in views</p>
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