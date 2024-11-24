import { JSONContent } from "@tiptap/react";

export interface Folder {
    id: string;
    name: string;
    documentIds: string[];
    createdAt: string;
    updatedAt: string;
}

export interface IDocument {
    id: string;
    title: string;
    content: JSONContent;
    createdAt: Date;
    updatedAt: Date;
    tags: string[];
    category: string;
}
