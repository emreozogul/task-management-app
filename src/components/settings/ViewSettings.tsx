import { SettingsCard } from './SettingsCard';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface ViewSettingsProps {
    settings: any;
    onChange: (settings: any) => void;
}

export const ViewSettings = ({ settings, onChange }: ViewSettingsProps) => {
    return (
        <SettingsCard
            title="View Settings"
            description="Customize how your tasks and projects are displayed"
        >
            <div className="space-y-4 text-primary-foreground">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <Label>Compact View</Label>
                        <p className="text-sm text-muted">Use compact layout for tasks</p>
                    </div>
                    <Switch
                        checked={settings.compactView}
                        onCheckedChange={(checked) => onChange({ ...settings, compactView: checked })}
                    />
                </div>

                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <Label>Show Task Count</Label>
                        <p className="text-sm text-muted">Display number of tasks in each view</p>
                    </div>
                    <Switch
                        checked={settings.showTaskCount}
                        onCheckedChange={(checked) => onChange({ ...settings, showTaskCount: checked })}
                    />
                </div>

                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <Label>Quick Add</Label>
                        <p className="text-sm text-muted">Enable quick task creation</p>
                    </div>
                    <Switch
                        checked={settings.enableQuickAdd}
                        onCheckedChange={(checked) => onChange({ ...settings, enableQuickAdd: checked })}
                    />
                </div>
            </div>
        </SettingsCard>
    );
};