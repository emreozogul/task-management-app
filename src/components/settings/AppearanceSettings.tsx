import { SettingsCard } from './SettingsCard';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface AppearanceSettingsProps {
    settings: any;
    onChange: (settings: any) => void;
}

export const AppearanceSettings = ({ settings, onChange }: AppearanceSettingsProps) => {
    return (
        <SettingsCard
            title="Appearance"
            description="Customize the look and feel of your workspace"
        >
            <div className="flex items-center justify-between">
                <Label>Theme</Label>
                <Select
                    value={settings.theme}
                    onValueChange={(value) => onChange({ ...settings, theme: value })}
                >
                    <SelectTrigger className="w-[180px] bg-secondary border-border">
                        <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent className="bg-secondary border-border">
                        <SelectItem value="light" className="text-foreground hover:bg-muted">Light</SelectItem>
                        <SelectItem value="dark" className="text-foreground hover:bg-muted">Dark</SelectItem>
                        <SelectItem value="system" className="text-foreground hover:bg-muted">System</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </SettingsCard>
    );
};