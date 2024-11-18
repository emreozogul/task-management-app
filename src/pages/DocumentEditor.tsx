import { useRef, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { deepClone, useDocumentStore } from '@/stores/documentStore';
import { DocumentHeader } from '@/components/editor/DocumentHeader';
import Editor from '@/components/editor/Editor';
import { JSONContent } from 'novel';
import { DocumentStatus } from '@/components/editor/DocumentStatus';

const DocumentEditor = () => {
    const { documentId } = useParams<{ documentId: string }>();
    const navigate = useNavigate();
    const titleInputRef = useRef<HTMLInputElement>(null);
    const {
        documents,
        updateDocument,
        setActiveDocument,
        activeDocument
    } = useDocumentStore();

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const document = documents.find(doc => doc.id === documentId);
        if (document) {
            setActiveDocument(document);
        }
        setIsLoading(false);
    }, [documentId, documents, setActiveDocument]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!activeDocument) {
        navigate('/documents');
        return null;
    }

    const handleEditorUpdate = (content: JSONContent) => {
        if (!activeDocument) return;

        const newContent = {
            ...deepClone(content),
            documentId: activeDocument.id
        };

        updateDocument(activeDocument.id, {
            content: newContent,
            updatedAt: new Date()
        });


    };

    return (
        <div className="container mx-auto px-2 sm:px-6 py-4 sm:py-6 space-y-4">
            <DocumentHeader
                titleInputRef={titleInputRef}
                title={activeDocument.title}
                status={activeDocument.status}
                document={activeDocument}
                onTitleChange={(e) => {
                    updateDocument(activeDocument.id, {
                        title: e.target.value,
                        updatedAt: new Date()
                    });
                }}
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

            <div className="prose-container bg-[#232430] rounded-lg w-full">
                <Editor
                    key={activeDocument.id}
                    documentId={activeDocument.id}
                    onUpdate={handleEditorUpdate}
                    initialContent={activeDocument.content}
                />
            </div>
        </div>
    );
};

export default DocumentEditor;

