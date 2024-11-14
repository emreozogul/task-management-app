import { JSONContent } from '@tiptap/react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Document {
    id: string;
    title: string;
    content: JSONContent;
    createdAt: Date;
    updatedAt: Date;
    tags: string[];
    category: string;
    status: 'draft' | 'published' | 'archived';
}

interface DocumentStore {
    documents: Document[];
    activeDocument: Document | null;
    createDocument: (title: string, category: string) => Document;
    updateDocument: (id: string, updates: Partial<Document>) => void;
    deleteDocument: (id: string) => void;
    setActiveDocument: (document: Document | null) => void;
    getDocumentsByCategory: (category: string) => Document[];
    getDocumentsByTag: (tag: string) => Document[];
}

export const useDocumentStore = create<DocumentStore>()(
    persist(
        (set, get) => ({
            documents: [],
            activeDocument: null,

            createDocument: (title: string, category: string) => {
                const documents = get().documents;
                let newTitle = title;
                let counter = 1;

                // Check for existing untitled documents
                while (documents.some(doc => doc.title === newTitle)) {
                    newTitle = `${title} ${counter}`;
                    counter++;
                }

                const newDocument: Document = {
                    id: crypto.randomUUID(),
                    title: newTitle,
                    content: {
                        type: 'doc',
                        content: [
                            {
                                type: 'paragraph',
                                content: []
                            }
                        ]
                    },
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    tags: [],
                    category,
                    status: 'draft',
                };

                set((state) => ({
                    documents: [...state.documents, newDocument],
                    activeDocument: newDocument,
                }));

                return newDocument;
            },

            updateDocument: (id: string, updates: Partial<Document>) => {
                set((state) => {
                    const updatedDocuments = state.documents.map((doc) =>
                        doc.id === id
                            ? {
                                ...doc,
                                ...updates,
                                updatedAt: updates.updatedAt || new Date(),
                            }
                            : doc
                    );

                    return {
                        documents: updatedDocuments,
                        activeDocument: state.activeDocument?.id === id
                            ? {
                                ...state.activeDocument,
                                ...updates,
                                updatedAt: updates.updatedAt || new Date(),
                            }
                            : state.activeDocument,
                    };
                });
            },

            deleteDocument: (id: string) => {
                set((state) => ({
                    documents: state.documents.filter((doc) => doc.id !== id),
                    activeDocument:
                        state.activeDocument?.id === id ? null : state.activeDocument,
                }));
            },

            setActiveDocument: (document) => {
                set({ activeDocument: document });
            },

            getDocumentsByCategory: (category: string) => {
                return get().documents.filter((doc) => doc.category === category);
            },

            getDocumentsByTag: (tag: string) => {
                return get().documents.filter((doc) => doc.tags.includes(tag));
            },
        }),
        {
            name: 'document-storage',
            version: 1,
        }
    )
);
