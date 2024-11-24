import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Download, FileText } from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import DocumentPDF from '../document/DocumentPDF';
import { IDocument } from '@/types/document';
import { exportToDocx } from '@/utils/docxExport';
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
            className="text-2xl font-bold w-full sm:w-1/2 bg-[#383844] border-[#4e4e59] text-white"
            placeholder="Document Title"
        />
        <div className="flex items-center gap-2 w-full sm:w-auto">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="border-[#383844] text-white hover:bg-[#383844]">
                        <Download className="w-4 h-4 mr-2" />
                        Export
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-[#232430] border-[#383844]">
                    <PDFDownloadLink
                        document={<DocumentPDF document={document} />}
                        fileName={`${document.title}.pdf`}
                    >
                        <DropdownMenuItem className="text-white hover:bg-[#383844] cursor-pointer">
                            <FileText className="w-4 h-4 mr-2" />
                            Export as PDF
                        </DropdownMenuItem>
                    </PDFDownloadLink>
                    <DropdownMenuItem
                        className="text-white hover:bg-[#383844] cursor-pointer"
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
