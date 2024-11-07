import React, { useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useDocumentStore } from '@/stores/documentStore';
import { DocumentHeader } from '@/components/document/DocumentHeader';
import { TagList } from '@/components/document/TagList';
import { DocumentStatus } from '@/components/document/DocumentStatus';
import debounce from 'lodash/debounce';

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

    // Create a debounced update function
    const debouncedUpdate = useCallback(
        debounce((content: string) => {
            if (activeDocument) {
                updateDocument(activeDocument.id, {
                    content,
                    updatedAt: new Date(),
                });
            }
        }, 1000), // 1 second delay
        [activeDocument, updateDocument]
    );

    const editor = useEditor({
        extensions: [
            StarterKit,
        ],
        editorProps: {
            attributes: {
                class: 'prose prose-invert prose-lg max-w-none focus:outline-none',
            },
        },
        content: activeDocument?.content || '<p>Start writing...</p>',
        onUpdate: ({ editor }) => {
            const content = editor.getHTML();
            // Use setTimeout to debounce updates
            const timeoutId = setTimeout(() => {
                debouncedUpdate(content);
            }, 500); // Adjust debounce delay as needed
            return () => clearTimeout(timeoutId);
        },
    });

    // Initialize document only once when component mounts or documentId changes
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
                isInitializedRef.current = true;
                navigate(`/documents/${newDoc.id}`, { replace: true });
                setActiveDocument(newDoc);
                editor?.commands.setContent(newDoc.content);
                setTimeout(() => {
                    if (titleInputRef.current) {
                        titleInputRef.current.focus();
                        titleInputRef.current.select();
                    }
                }, 100);
            } else if (documentId) {
                const doc = documents.find((d) => d.id === documentId);
                if (doc) {
                    setActiveDocument(doc);
                    editor?.commands.setContent(doc.content || '<p>Start writing...</p>');
                } else {
                    navigate('/documents', { replace: true });
                }
            }
        };

        initializeDocument();
    }, [documentId, documents, createDocument, navigate, setActiveDocument, editor]);

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

    const handlePublish = () => {
        if (activeDocument) {
            updateDocument(activeDocument.id, {
                status: 'published',
                updatedAt: new Date()
            });
        }
    };

    const handleArchive = () => {
        if (activeDocument) {
            updateDocument(activeDocument.id, {
                status: 'archived',
                updatedAt: new Date()
            });
            navigate('/documents');
        }
    };

    // Update the editor content change handler
    const handleContentChange = useCallback(() => {
        const content = editor?.getHTML();
        if (content) {
            debouncedUpdate(content);
        }
    }, [editor, debouncedUpdate]);

    useEffect(() => {
        if (editor) {
            editor.on('update', handleContentChange);
            return () => {
                editor.off('update', handleContentChange);
            };
        }
    }, [editor, handleContentChange]);

    if (!activeDocument) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-lg">Loading document...</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 space-y-4">
            <DocumentHeader
                title={activeDocument.title}
                status={activeDocument.status}
                titleInputRef={titleInputRef}
                onTitleChange={handleTitleChange}
                onPublish={handlePublish}
                onArchive={handleArchive}
            />
            <DocumentStatus
                status={activeDocument.status}
                updatedAt={activeDocument.updatedAt}
            />
            <TagList
                tags={activeDocument.tags}
                onAddTag={handleAddTag}
            />

            <div className="prose-container">
                <EditorContent
                    editor={editor}
                    className="prose prose-invert prose-lg max-w-none min-h-[500px] bg-[#232430] rounded-lg p-6 text-white focus:outline-none"
                />
            </div>
        </div>
    );
};

export default DocumentEditor;
