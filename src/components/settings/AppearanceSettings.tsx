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
                    <SelectTrigger className="w-[180px] bg-background-hover border-border text-primary-foreground">
                        <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent className="bg-background-secondary border-border">
                        <SelectItem value="light" className="text-primary-foreground hover:bg-background-hover">Light</SelectItem>
                        <SelectItem value="dark" className="text-primary-foreground hover:bg-background-hover">Dark</SelectItem>
                        <SelectItem value="system" className="text-primary-foreground hover:bg-background-hover">System</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </SettingsCard>
    );
};