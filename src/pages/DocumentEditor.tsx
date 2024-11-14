import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDocumentStore } from '@/stores/documentStore';
import { DocumentHeader } from '@/components/editor/DocumentHeader';
import { TagList } from '@/components/editor/TagList';
import { DocumentStatus } from '@/components/editor/DocumentStatus';
import Editor from '@/components/editor/Editor';
import { JSONContent } from 'novel';

const DocumentEditor = () => {
    const navigate = useNavigate();
    const {
        activeDocument,
        updateDocument,
    } = useDocumentStore();
    const titleInputRef = useRef<HTMLInputElement>(null);

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

    const handleEditorUpdate = (content: JSONContent) => {
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
                document={activeDocument}
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
                <Editor
                    onUpdate={handleEditorUpdate}
                    initialContent={activeDocument.content}
                />
            </div>
        </div>
    );
};

export default DocumentEditor;
