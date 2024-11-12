import React, { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDocumentStore } from '@/stores/documentStore';
import { DocumentHeader } from '@/components/document/DocumentHeader';
import { TagList } from '@/components/document/TagList';
import { DocumentStatus } from '@/components/document/DocumentStatus';
import TailwindAdvancedEditor from '@/components/editor/Editor';

const DocumentEditor = () => {
    const { documentId } = useParams();
    const navigate = useNavigate();
    const {
        documents,
        activeDocument,
        createDocument,
        updateDocument,
        setActiveDocument,
    } = useDocumentStore();
    const titleInputRef = useRef<HTMLInputElement>(null);
    const isInitializedRef = useRef(false);

    useEffect(() => {
        isInitializedRef.current = false;
    }, [documentId]);

    useEffect(() => {
        const initializeDocument = async () => {
            if (isInitializedRef.current) return;

            if (documentId === 'new') {
                const timestamp = new Date().toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });
                const newDoc = createDocument(`Document - ${timestamp}`, 'general');
                navigate(`/documents/${newDoc.id}`, { replace: true });
                setActiveDocument(newDoc);
            } else if (documentId) {
                const doc = documents.find((d) => d.id === documentId);
                if (doc) {
                    setActiveDocument(doc);
                } else {
                    navigate('/documents', { replace: true });
                }
            }
            isInitializedRef.current = true;
        };

        initializeDocument();
    }, [documentId, documents, createDocument, navigate, setActiveDocument]);

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (activeDocument) {
            updateDocument(activeDocument.id, {
                title: e.target.value,
                updatedAt: new Date()
            });
        }
    };

    const handleAddTag = () => {
        const tag = prompt('Enter new tag:');
        if (tag && activeDocument && !activeDocument.tags.includes(tag)) {
            updateDocument(activeDocument.id, {
                tags: [...activeDocument.tags, tag],
                updatedAt: new Date()
            });
        }
    };

    const handleEditorUpdate = (content: string) => {
        if (activeDocument) {
            updateDocument(activeDocument.id, {
                content,
                updatedAt: new Date()
            });
        }
    };

    if (!activeDocument) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto px-2 sm:px-6 py-4 sm:py-6 space-y-4">
            <DocumentHeader
                title={activeDocument.title}
                status={activeDocument.status}
                titleInputRef={titleInputRef}
                onTitleChange={handleTitleChange}
                onPublish={() => {
                    updateDocument(activeDocument.id, {
                        status: 'published',
                        updatedAt: new Date()
                    });
                }}
                onArchive={() => {
                    updateDocument(activeDocument.id, {
                        status: 'archived',
                        updatedAt: new Date()
                    });
                    navigate('/documents');
                }}
            />
            <DocumentStatus
                status={activeDocument.status}
                updatedAt={activeDocument.updatedAt}
            />
            <TagList
                tags={activeDocument.tags}
                onAddTag={handleAddTag}
            />

            <div className="prose-container bg-[#232430] rounded-lg w-full">
                <TailwindAdvancedEditor
                    initialDocumentContent={activeDocument.content}
                    onUpdate={handleEditorUpdate}
                />
            </div>
        </div>
    );
};

export default DocumentEditor;
