import { JSONContent } from '@tiptap/react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import _ from 'lodash';
import { IDocument, Folder } from '@/types/document';


interface DocumentStore {
    documents: IDocument[];
    activeDocument: IDocument | null;
    createDocument: (title: string, category: string) => IDocument;
    updateDocument: (id: string, updates: Partial<IDocument>) => void;
    deleteDocument: (id: string) => void;
    setActiveDocument: (document: IDocument | null) => void;
    folders: Folder[];
    createFolder: (name: string) => void;
    addDocumentToFolder: (folderId: string, documentId: string) => void;
    removeDocumentFromFolder: (folderId: string, documentId: string) => void;
    deleteFolder: (id: string) => void;
}

// Deep clone helper
const deepClone = <T>(obj: T): T => _.cloneDeep(obj);

export { deepClone };

export const useDocumentStore = create<DocumentStore>()(
    persist(
        (set, _) => ({
            documents: [],
            activeDocument: null,

            createDocument: (title: string) => {
                const id = crypto.randomUUID();

                const initialContent: JSONContent = {
                    type: 'doc',
                    content: [{
                        type: 'paragraph',
                        content: [{
                            type: 'text',
                            text: ''
                        }]
                    }],
                    documentId: id
                };

                const newDocument: IDocument = {
                    id,
                    title,
                    content: deepClone(initialContent),
                    createdAt: new Date(),
                    updatedAt: new Date(),
                };

                set(state => ({
                    documents: [...state.documents, newDocument],
                    activeDocument: newDocument
                }));

                return newDocument;
            },

            updateDocument: (id: string, updates: Partial<IDocument>) => {
                console.log(`Updating document with ID: ${id}`, updates);
                set(state => {
                    const updatedDocuments = state.documents.map(doc => {
                        if (doc.id !== id) return doc;

                        console.log(`Original Content for Document ID ${id}:`, doc.content);
                        if (updates.content) {
                            console.log(`New Content for Document ID ${id}:`, updates.content);
                        }

                        const newContent = updates.content
                            ? { ...deepClone(updates.content), documentId: id }
                            : { ...deepClone(doc.content), documentId: id };

                        return {
                            ...doc,
                            ...updates,
                            content: newContent,
                            updatedAt: new Date(),
                        };
                    });

                    const updatedActiveDocument = state.activeDocument?.id === id
                        ? updatedDocuments.find(doc => doc.id === id) || state.activeDocument
                        : state.activeDocument;

                    console.log('Updated activeDocument:', updatedActiveDocument);

                    return {
                        documents: updatedDocuments,
                        activeDocument: updatedActiveDocument,
                    };
                });
            },

            setActiveDocument: (document) => {
                if (!document) {
                    set({ activeDocument: null });
                    return;
                }

                // Ensure content has document ID when setting active
                const contentWithId = {
                    ...deepClone(document.content),
                    documentId: document.id
                };

                set({
                    activeDocument: {
                        ...document,
                        content: contentWithId
                    }
                });
            },

            deleteDocument: (id: string) => {
                set(state => ({
                    documents: state.documents.filter(doc => doc.id !== id),
                    activeDocument: state.activeDocument?.id === id ? null : state.activeDocument
                }));
            },

            folders: [],

            createFolder: (name: string) => {
                const newFolder: Folder = {
                    id: crypto.randomUUID(),
                    name,
                    documentIds: [],
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                };
                set(state => ({
                    folders: [...state.folders, newFolder]
                }));
            },

            addDocumentToFolder: (folderId: string, documentId: string) => {
                set(state => ({
                    folders: state.folders.map(folder =>
                        folder.id === folderId
                            ? { ...folder, documentIds: [...folder.documentIds, documentId] }
                            : folder
                    )
                }));
            },

            removeDocumentFromFolder: (folderId: string, documentId: string) => {
                set(state => ({
                    folders: state.folders.map(folder =>
                        folder.id === folderId
                            ? { ...folder, documentIds: folder.documentIds.filter(id => id !== documentId) }
                            : folder
                    )
                }));
            },

            deleteFolder: (id: string) => {
                set(state => ({
                    folders: state.folders.filter(folder => folder.id !== id)
                }));
            }
        }),
        {
            name: 'document-storage',
            version: 1,
            storage: {
                getItem: (name) => {
                    const str = localStorage.getItem(name);
                    if (!str) return null;

                    const parsed = JSON.parse(str);
                    return {
                        state: {
                            documents: parsed.state.documents.map((doc: any) => ({
                                ...doc,
                                content: {
                                    ...deepClone(doc.content),
                                    documentId: doc.id
                                },
                                createdAt: new Date(doc.createdAt),
                                updatedAt: new Date(doc.updatedAt)
                            })),
                            activeDocument: parsed.state.activeDocument ? {
                                ...parsed.state.activeDocument,
                                content: {
                                    ...deepClone(parsed.state.activeDocument.content),
                                    documentId: parsed.state.activeDocument.id
                                },
                                createdAt: new Date(parsed.state.activeDocument.createdAt),
                                updatedAt: new Date(parsed.state.activeDocument.updatedAt)
                            } : null
                        },
                        version: parsed.version
                    };
                },
                setItem: (name, value) => {
                    const toStore = {
                        state: {
                            documents: value.state.documents.map((doc: IDocument) => ({
                                ...doc,
                                content: {
                                    ...deepClone(doc.content),
                                    documentId: doc.id
                                },
                                createdAt: doc.createdAt.toISOString(),
                                updatedAt: doc.updatedAt.toISOString()
                            })),
                            activeDocument: value.state.activeDocument ? {
                                ...value.state.activeDocument,
                                content: {
                                    ...deepClone(value.state.activeDocument.content),
                                    documentId: value.state.activeDocument.id
                                },
                                createdAt: value.state.activeDocument.createdAt.toISOString(),
                                updatedAt: value.state.activeDocument.updatedAt.toISOString()
                            } : null
                        },
                        version: value.version
                    };
                    localStorage.setItem(name, JSON.stringify(toStore));
                },
                removeItem: (name) => localStorage.removeItem(name)
            }
        }
    )
);
