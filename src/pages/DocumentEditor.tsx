import { useRef, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { deepClone, useDocumentStore } from '@/stores/documentStore';
import { DocumentHeader } from '@/components/editor/DocumentHeader';
import Editor from '@/components/editor/Editor';
import { JSONContent } from 'novel';

const DocumentEditor = () => {
    const { documentId } = useParams();
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
        const document = documents.find(d => d.id === documentId);
        if (document) {
            setActiveDocument(document);
            setIsLoading(false);
        } else {
            navigate('/documents');
        }
    }, [documentId, documents, setActiveDocument, navigate]);

    if (isLoading) {
        return (
            <div className="min-h-[calc(100vh-4rem)] bg-background flex items-center justify-center">
                <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            </div>
        );
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
        <div className="min-h-[calc(100vh-4rem)] bg-background px-2 sm:px-6 py-4 sm:py-6 space-y-4">
            <DocumentHeader
                titleInputRef={titleInputRef}
                title={activeDocument.title}
                document={activeDocument}
                onTitleChange={(e) => {
                    updateDocument(activeDocument.id, {
                        title: e.target.value,
                        updatedAt: new Date()
                    });
                }}
            />

            <div className="prose-container bg-background-secondary rounded-lg w-full">
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

