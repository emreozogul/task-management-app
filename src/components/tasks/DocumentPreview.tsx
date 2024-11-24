import { FileText, ExternalLink } from "lucide-react";
import { useDocumentStore } from "@/stores/documentStore";
import { Button } from "@/components/ui/button";
import { JSONContent } from "@tiptap/react";
import { Link } from "react-router-dom";
interface DocumentPreviewProps {
    documentId: string | undefined;
}

export const DocumentPreview = ({ documentId }: DocumentPreviewProps) => {
    const { documents } = useDocumentStore();
    const document = documents.find(doc => doc.id === documentId);

    if (!document) return null;

    // Convert JSONContent to plain text for preview
    const getPlainText = (content: JSONContent): string => {
        if (!content.content) return '';

        return content.content.reduce((text, node) => {
            if (node.type === 'text' && node.text) {
                return text + node.text + ' ';
            }
            if (node.content) {
                return text + getPlainText(node) + ' ';
            }
            return text;
        }, '');
    };

    const plainText = getPlainText(document.content);

    return (
        <div className="bg-[#383844] rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#6775bc]" />
                    <span className="text-sm font-medium text-white">{document.title}</span>
                </div>
                <Link to={`/documents/${document.id}`}>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-[#232430]"
                        onClick={() => {/* Add navigation to document */ }}
                    >
                        <ExternalLink className="h-4 w-4 text-[#6775bc]" />
                    </Button>
                </Link>
            </div>
            <p className="text-sm text-[#95959c] line-clamp-3">
                {plainText}
            </p>
        </div>
    );
};