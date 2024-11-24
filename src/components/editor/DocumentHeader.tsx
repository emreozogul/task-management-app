import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Download, FileText } from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import DocumentPDF from '../document/DocumentPDF';
import { IDocument } from '@/types/document';
import { exportToDocx } from '@/lib/docxExport';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DocumentHeaderProps {
    title: string;
    document: IDocument;
    titleInputRef: React.RefObject<HTMLInputElement>;
    onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const DocumentHeader = ({
    title,
    document,
    titleInputRef,
    onTitleChange,
}: DocumentHeaderProps) => (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-lg">
        <Input
            ref={titleInputRef}
            value={title}
            onChange={onTitleChange}
            className="text-2xl font-bold w-full sm:w-1/2 bg-background-hover border-border text-primary-foreground"
            placeholder="Document Title"
        />
        <div className="flex items-center gap-2 w-full sm:w-auto">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="border-border text-primary-foreground hover:bg-background-hover">
                        <Download className="w-4 h-4 mr-2" />
                        Export
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-background-secondary border-border">
                    <PDFDownloadLink
                        document={<DocumentPDF document={document} />}
                        fileName={`${document.title}.pdf`}
                    >
                        <DropdownMenuItem className="text-primary-foreground hover:bg-background-hover cursor-pointer">
                            <FileText className="w-4 h-4 mr-2" />
                            Export as PDF
                        </DropdownMenuItem>
                    </PDFDownloadLink>
                    <DropdownMenuItem
                        className="text-primary-foreground hover:bg-background-hover cursor-pointer"
                        onClick={() => exportToDocx(document)}
                    >
                        <FileText className="w-4 h-4 mr-2" />
                        Export as DOCX
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    </div>
);
