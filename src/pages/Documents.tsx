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
import { useDialogKeyboard } from '@/hooks/useDialogKeyboard';

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

    const handleCancel = () => {
        setNewFolderName('');
        setIsCreateFolderOpen(false);
    };

    useDialogKeyboard({
        isOpen: isCreateFolderOpen,
        onClose: handleCancel,
        onSubmit: () => {
            if (newFolderName.trim()) {
                createFolder(newFolderName.trim());
                setNewFolderName('');
                setIsCreateFolderOpen(false);
            }
        }
    });

    return (
        <div className="p-6">
            <div className="grid grid-cols-[220px_1fr] gap-6">
                {/* Left Sidebar - Folders */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between mb-4">
                        <Button
                            onClick={() => setIsCreateFolderOpen(true)}
                            variant="outline"
                            className="w-full border-border text-primary-foreground hover:bg-background-hover hover:text-primary"
                        >
                            <FolderIcon className="w-4 h-4 mr-2" />
                            New Folder
                        </Button>
                    </div>

                    <div
                        onClick={() => setSelectedFolder(null)}
                        className={cn(
                            "flex items-center p-2 rounded-lg cursor-pointer",
                            !selectedFolder ? "bg-background-hover text-primary-foreground" : "text-muted hover:bg-background-hover hover:text-primary-foreground"
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
                                    ? "bg-background-hover text-primary-foreground"
                                    : "text-muted hover:bg-background-hover hover:text-primary-foreground"
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
                                className="opacity-0 group-hover:opacity-100 hover:bg-background-hover"
                                onClick={() => {
                                    deleteFolder(folder.id);
                                    setSelectedFolder(null);
                                }}
                            >
                                <Trash2 className="w-4 h-4 text-muted" />
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
                                    className="flex flex-col p-4 rounded-lg border border-border bg-background-secondary hover:bg-background-hover transition-colors"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="font-semibold text-primary-foreground truncate pr-2">{doc.title}</h3>
                                    </div>
                                    <p className="text-muted text-sm truncate">{doc.createdAt.toLocaleString()}</p>
                                </Link>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="absolute top-2 right-2 h-8 w-8 p-0 opacity-0 group-hover:opacity-100"
                                        >
                                            <MoreVertical className="h-4 w-4 text-primary-foreground" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="bg-background-secondary border-border">
                                        <DropdownMenuItem
                                            className="text-muted px-3 py-2 text-sm hover:bg-background-hover cursor-pointer"
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
                <DialogContent className="bg-background-secondary text-primary-foreground">
                    <DialogHeader>
                        <DialogTitle>Create New Folder</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <Input
                            value={newFolderName}
                            onChange={(e) => setNewFolderName(e.target.value)}
                            placeholder="Folder name"
                            className="bg-background-hover border-border text-primary-foreground"
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
                            className="bg-primary hover:bg-primary-hover text-primary-foreground"
                        >
                            Create
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Folder Selection Dialog */}
            <Dialog open={isFolderSelectOpen} onOpenChange={setIsFolderSelectOpen}>
                <DialogContent className="bg-background-secondary text-primary-foreground sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Select Folder</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <Input
                            placeholder="Search folders..."
                            value={folderSearch}
                            onChange={(e) => setFolderSearch(e.target.value)}
                            className="bg-background-hover border-border text-primary-foreground"
                        />
                        <div className="max-h-[300px] overflow-y-auto space-y-2">
                            {filteredFolders.map((folder) => (
                                <div
                                    key={folder.id}
                                    onClick={() => selectedDocument && handleMoveToFolder(selectedDocument, folder.id)}
                                    className="flex items-center justify-between p-2 rounded-lg cursor-pointer hover:bg-background-hover group"
                                >
                                    <div className="flex items-center">
                                        <FolderIcon className="w-4 h-4 mr-2 text-primary" />
                                        <span className="text-primary-foreground">{folder.name}</span>
                                    </div>
                                    <span className="text-xs text-muted">
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