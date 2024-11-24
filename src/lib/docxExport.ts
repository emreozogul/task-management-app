import { Document, Packer, Paragraph, TextRun } from 'docx';
import { IDocument } from '@/types/document';
import DOMPurify from 'dompurify';

export const exportToDocx = async (doc: IDocument) => {
    // Clean HTML content
    const cleanContent = DOMPurify.sanitize(doc.content.toString(), { ALLOWED_TAGS: [] });

    const docx = new Document({
        sections: [{
            properties: {},
            children: [
                new Paragraph({
                    children: [
                        new TextRun({
                            text: doc.title,
                            bold: true,
                            size: 32,
                        }),
                    ],
                }),
                new Paragraph({
                    children: [
                        new TextRun({
                            text: `Created: ${new Date(doc.createdAt).toLocaleDateString()}`,
                            size: 20,
                            color: '666666',
                        }),
                    ],
                }),
                new Paragraph({
                    children: [
                        new TextRun({
                            text: cleanContent,
                            size: 24,
                        }),
                    ],
                }),
            ],
        }],
    });

    const blob = await Packer.toBlob(docx);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${doc.title}.docx`;
    link.click();
    window.URL.revokeObjectURL(url);
}; 