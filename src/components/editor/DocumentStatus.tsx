interface DocumentStatusProps {
    status: string;
    updatedAt: Date;
}

export const DocumentStatus = ({ status, updatedAt }: DocumentStatusProps) => (
    <div className="text-sm text-muted-foreground">
        Last updated: {new Date(updatedAt).toLocaleString()}
        <span className="ml-4 text-muted-foreground">
            Status: {status}
        </span>
    </div>
); 