import { Link } from 'react-router-dom';
import { useDocumentStore } from '@/stores/documentStore';
import { cn } from '@/lib/utils';
import { useSearchStore } from '@/stores/searchStore';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Folder as FolderIcon, MoreVertical, FileText, Trash2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useState } from 'react';

const Documents = () => {
    const { documents, folders, createFolder, addDocumentToFolder, removeDocumentFromFolder, deleteFolder } = useDocumentStore();
    const { query } = useSearchStore();
    const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
    const [isFolderSelectOpen, setIsFolderSelectOpen] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
    const [folderSearch, setFolderSearch] = useState('');
    const [newFolderName, setNewFolderName] = useState('');
    const [selectedFolder, setSelectedFolder] = useState<string | null>(null);

    const filteredDocuments = documents.filter((doc) => {
        const matchesSearch = doc.title.toLowerCase().includes(query.toLowerCase());
        if (selectedFolder) {
            const folder = folders.find(f => f.id === selectedFolder);
            return matchesSearch && folder?.documentIds.includes(doc.id);
        }
        return matchesSearch;
    });

    const filteredFolders = folders.filter(folder =>
        folder.name.toLowerCase().includes(folderSearch.toLowerCase())
    );

    const handleMoveToFolder = (documentId: string, folderId: string) => {
        folders.forEach(folder => {
            if (folder.documentIds.includes(documentId)) {
                removeDocumentFromFolder(folder.id, documentId);
            }
        });
        addDocumentToFolder(folderId, documentId);
        setIsFolderSelectOpen(false);
        setSelectedDocument(null);
    };

    return (
        <div className="p-6">
            <div className="grid grid-cols-[220px_1fr] gap-6">
                {/* Left Sidebar - Folders */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between mb-4">
                        <Button
                            onClick={() => setIsCreateFolderOpen(true)}
                            variant="outline"
                            className="w-full border-[#383844] text-white hover:bg-[#383844] hover:text-[#6775bc]"
                        >
                            <FolderIcon className="w-4 h-4 mr-2" />
                            New Folder
                        </Button>
                    </div>

                    <div
                        onClick={() => setSelectedFolder(null)}
                        className={cn(
                            "flex items-center p-2 rounded-lg cursor-pointer",
                            !selectedFolder ? "bg-[#383844] text-white" : "text-[#95959c] hover:bg-[#383844] hover:text-white"
                        )}
                    >
                        <FileText className="w-4 h-4 mr-2" />
                        All Documents
                    </div>

                    {folders.map((folder) => (
                        <div
                            key={folder.id}
                            className={cn(
                                "flex items-center justify-between p-2 rounded-lg cursor-pointer group",
                                selectedFolder === folder.id
                                    ? "bg-[#383844] text-white"
                                    : "text-[#95959c] hover:bg-[#383844] hover:text-white"
                            )}
                        >
                            <div
                                className="flex items-center flex-1"
                                onClick={() => setSelectedFolder(folder.id)}
                            >
                                <FolderIcon className="w-4 h-4 mr-2" />
                                <span>{folder.name}</span>
                                <span className="ml-2 text-xs opacity-60">
                                    ({folder.documentIds.length})
                                </span>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="opacity-0 group-hover:opacity-100 hover:bg-[#4e4e59]"
                                onClick={() => {
                                    deleteFolder(folder.id);
                                    setSelectedFolder(null);
                                }}
                            >
                                <Trash2 className="w-4 h-4 text-[#95959c]" />
                            </Button>
                        </div>
                    ))}
                </div>

                {/* Right Side - Documents */}
                <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filteredDocuments.map((doc) => (
                            <div key={doc.id} className="group relative">
                                <Link
                                    to={`/documents/${doc.id}`}
                                    className="flex flex-col p-4 rounded-lg border border-[#383844] bg-[#232430] hover:bg-[#383844] transition-colors"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="font-semibold text-white truncate pr-2">{doc.title}</h3>

                                    </div>
                                </Link>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="absolute top-2 right-2 h-8 w-8 p-0 opacity-0 group-hover:opacity-100"
                                        >
                                            <MoreVertical className="h-4 w-4 text-white" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="bg-[#232430] border-[#383844]">
                                        <DropdownMenuItem
                                            className="text-[#95959c] px-3 py-2 text-sm hover:bg-[#383844] cursor-pointer"
                                            onClick={() => {
                                                setSelectedDocument(doc.id);
                                                setIsFolderSelectOpen(true);
                                            }}
                                        >
                                            <FolderIcon className="w-4 h-4 mr-2" />
                                            Move to Folder
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <Dialog open={isCreateFolderOpen} onOpenChange={setIsCreateFolderOpen}>
                <DialogContent className="bg-[#232430] text-white">
                    <DialogHeader>
                        <DialogTitle>Create New Folder</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <Input
                            value={newFolderName}
                            onChange={(e) => setNewFolderName(e.target.value)}
                            placeholder="Folder name"
                            className="bg-[#383844] border-[#4e4e59] text-white"
                        />
                    </div>
                    <DialogFooter>
                        <Button
                            onClick={() => {
                                if (newFolderName.trim()) {
                                    createFolder(newFolderName.trim());
                                    setNewFolderName('');
                                    setIsCreateFolderOpen(false);
                                }
                            }}
                            className="bg-[#6775bc] hover:bg-[#7983c4] text-white"
                        >
                            Create
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Folder Selection Dialog */}
            <Dialog open={isFolderSelectOpen} onOpenChange={setIsFolderSelectOpen}>
                <DialogContent className="bg-[#232430] text-white sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Select Folder</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <Input
                            placeholder="Search folders..."
                            value={folderSearch}
                            onChange={(e) => setFolderSearch(e.target.value)}
                            className="bg-[#383844] border-[#4e4e59] text-white"
                        />
                        <div className="max-h-[300px] overflow-y-auto space-y-2">
                            {filteredFolders.map((folder) => (
                                <div
                                    key={folder.id}
                                    onClick={() => selectedDocument && handleMoveToFolder(selectedDocument, folder.id)}
                                    className="flex items-center justify-between p-2 rounded-lg cursor-pointer hover:bg-[#383844] group"
                                >
                                    <div className="flex items-center">
                                        <FolderIcon className="w-4 h-4 mr-2 text-[#6775bc]" />
                                        <span className="text-white">{folder.name}</span>
                                    </div>
                                    <span className="text-xs text-[#95959c]">
                                        {folder.documentIds.length} documents
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Documents; 