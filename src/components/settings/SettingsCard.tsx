import { ReactNode } from 'react';

interface SettingsCardProps {
    title: string;
    description?: string;
    children: ReactNode;
}

export const SettingsCard = ({ title, description, children }: SettingsCardProps) => {
    return (
        <div className="bg-background-secondary p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2 text-primary-foreground">{title}</h2>
            {description && (
                <p className="text-sm text-muted mb-4">{description}</p>
            )}
            <div className="space-y-4">
                {children}
            </div>
        </div>
    );
};