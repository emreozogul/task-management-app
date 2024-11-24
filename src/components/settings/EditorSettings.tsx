import { SettingsCard } from './SettingsCard';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface EditorSettingsProps {
    settings: any;
    onChange: (settings: any) => void;
}

export const EditorSettings = ({ settings, onChange }: EditorSettingsProps) => {
    return (
        <SettingsCard
            title="Editor"
            description="Configure your editing preferences"
        >
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <Label>Auto-save</Label>
                    <p className="text-sm text-[#95959c]">Automatically save changes while editing</p>
                </div>
                <Switch
                    checked={settings.autoSave}
                    onCheckedChange={(checked) => onChange({ ...settings, autoSave: checked })}
                />
            </div>
        </SettingsCard>
    );
};