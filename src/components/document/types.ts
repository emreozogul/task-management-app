export interface Document {
    id: string;
    title: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    tags: string[];
    category: string;
    status: 'draft' | 'published' | 'archived';
}
