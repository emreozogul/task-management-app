import { EditorContent, Editor } from '@tiptap/react';

interface DocumentEditorProps {
    editor: Editor | null;
}

export const DocumentEditor = ({ editor }: DocumentEditorProps) => (
    <div className="prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto bg-[#232430] border-[#383844] rounded-lg p-4 prose-invert">
        <EditorContent editor={editor} className="min-h-[500px]" />
    </div>
); 