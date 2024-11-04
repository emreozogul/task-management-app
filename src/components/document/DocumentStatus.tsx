import React from 'react';
import { Badge } from '@/components/ui/badge';

interface DocumentStatusProps {
    status: string;
    updatedAt: Date;
}

export const DocumentStatus = ({ status, updatedAt }: DocumentStatusProps) => (
    <div className="text-sm text-muted-foreground">
        Last updated: {new Date(updatedAt).toLocaleString()}
        <span className="ml-4">
            Status: <Badge variant="outline">{status}</Badge>
        </span>
    </div>
); 