import { useState } from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const Settings = () => {
    const [theme, setTheme] = useState('dark');
    const [autoSave, setAutoSave] = useState(true);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6 text-white">Settings</h1>

            <div className="max-w-2xl space-y-6">
                <div className="bg-[#232430] p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4 text-white">Appearance</h2>
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <Label className="text-white">Theme</Label>
                            <Select value={theme} onValueChange={setTheme}>
                                <SelectTrigger className="w-[180px] bg-[#383844] border-[#4e4e59] text-white">
                                    <SelectValue placeholder="Select theme" />
                                </SelectTrigger>
                                <SelectContent className="bg-[#383844] border-[#4e4e59]">
                                    <SelectItem value="light" className="text-white hover:bg-[#4e4e59]">Light</SelectItem>
                                    <SelectItem value="dark" className="text-white hover:bg-[#4e4e59]">Dark</SelectItem>
                                    <SelectItem value="system" className="text-white hover:bg-[#4e4e59]">System</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                <div className="bg-[#232430] p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4 text-white">Editor</h2>
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <Label className="text-white">Auto-save</Label>
                                <p className="text-sm text-[#95959c]">Automatically save changes while editing</p>
                            </div>
                            <Switch
                                checked={autoSave}
                                onCheckedChange={setAutoSave}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;