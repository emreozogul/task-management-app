import { useLocation, useNavigate } from 'react-router-dom';
import { Plus, MoreVertical } from 'lucide-react';
import { useDocumentStore } from '@/stores/documentStore';
import { useTaskStore } from '@/stores/taskStore';
import { useKanbanStore } from '@/stores/kanbanStore';
import { useSearchStore } from '@/stores/searchStore';
import { TaskPriority } from '@/types/task';
import React from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Trash2 } from 'lucide-react';

const routeNames: { [key: string]: string } = {
    tasks: 'Tasks',
    boards: 'Kanban Boards',
    'boards/new': 'New Board',
    documents: 'Documents',
    calendar: 'Calendar',
    gantt: 'Timeline',
    widgets: 'Widgets',
    settings: 'Settings'
};

const hiddenHeaderRoutes = ['/', '/calendar'];

interface HeaderAction {
    path: string;
    label: string;
    icon: React.ReactNode;
    onClick: (...args: any[]) => void;
}

interface HeaderConfig {
    actions?: HeaderAction[];
    searchBar?: boolean;
    filters?: boolean;
    searchPlaceholder?: string;
}

const createRouteConfigs = (
    createTask: Function,
    createDocument: Function,
    navigate: Function,
    deleteBoard?: Function,
    activeBoard?: any,
    activeDocument?: any
): Record<string, HeaderConfig> => {
    const configs: Record<string, HeaderConfig> = {
        '/tasks': {
            actions: [{
                path: '/tasks',
                label: 'New Task',
                icon: <Plus className="w-4 h-4 mr-2" />,
                onClick: () => {
                    createTask({
                        title: 'New Task',
                        description: 'This is a new task',
                        priority: TaskPriority.LOW,
                        startDate: new Date().toISOString(),
                        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                    });
                }
            }]
        },
        '/boards': {
            actions: [{
                path: '/boards',
                label: 'New Board',
                icon: <Plus className="w-4 h-4 mr-2" />,
                onClick: () => navigate('/boards/new')
            }]
        },
        '/documents': {
            actions: [{
                path: '/documents',
                label: 'New Document',
                icon: <Plus className="w-4 h-4 mr-2" />,
                onClick: () => {
                    const timestamp = Date.now().toString(16);
                    const newDoc = createDocument(`Document - ${timestamp}`, 'general');
                    navigate(`/documents/${newDoc.id}`);
                }
            }],
            searchBar: true,
            searchPlaceholder: "Search documents..."
        }
    };

    // Handle dynamic document routes
    if (activeDocument) {
        configs[`/documents/${activeDocument.id}`] = {
            actions: []  // No actions needed for document editor
        };
    }

    // Handle dynamic board routes
    if (activeBoard) {
        configs[`/boards/${activeBoard.id}`] = {
            actions: [{
                path: `/boards/${activeBoard.id}`,
                label: '',
                icon: (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <div className="h-8 w-8 p-0  flex items-center justify-center cursor-pointer rounded-md">
                                <MoreVertical className="h-4 w-4" />
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-background-secondary border-border">
                            <DropdownMenuItem
                                className="text-destructive hover:text-destructive/90 hover:bg-background-hover cursor-pointer"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    if (activeBoard && deleteBoard) {
                                        deleteBoard(activeBoard.id);
                                        navigate('/boards');
                                    }
                                }}
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Board
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                ),
                onClick: () => { } // No-op since we're using dropdown
            }]
        };
    }

    return configs;
};

const getPageTitle = (path: string, activeBoard: any) => {
    // Special case for board ID in the path
    if (path.match(/^[0-9a-f-]+$/)) {  // Check if path segment is a UUID
        return activeBoard?.title || path;
    }

    return routeNames[path] || path.charAt(0).toUpperCase() + path.slice(1);
};

export const useHeader = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { createDocument, activeDocument } = useDocumentStore();
    const { createTask } = useTaskStore();
    const { activeBoard, deleteBoard } = useKanbanStore();
    const { query, setQuery } = useSearchStore();

    const isDocumentEditor = location.pathname.match(/^\/documents\/[^/]+$/);

    const handleSearch = (query: string) => {
        setQuery(query);
    };

    const shouldShowHeader = !hiddenHeaderRoutes.includes(location.pathname) && !isDocumentEditor;
    const routeConfigs = createRouteConfigs(
        createTask,
        createDocument,
        navigate,
        deleteBoard,
        activeBoard,
        activeDocument
    );

    const currentPath = location.pathname;
    let currentConfig = routeConfigs[currentPath];

    if (!currentConfig) {
        if (currentPath.startsWith('/boards/')) {
            const boardId = currentPath.split('/')[2];
            if (boardId && activeBoard?.id === boardId) {
                currentConfig = routeConfigs[`/boards/${activeBoard.id}`];
            } else if (boardId === 'new') {
                currentConfig = {};
            }
        }
    }

    currentConfig = currentConfig || {};

    return {
        shouldShowHeader,
        getPageTitle: (path: string) => getPageTitle(path, activeBoard),
        headerActions: currentConfig.actions || [],
        showSearchBar: currentConfig.searchBar || false,
        showFilters: currentConfig.filters || false,
        navigateTo: navigate,
        searchQuery: query,
        handleSearch,
        searchPlaceholder: currentConfig.searchPlaceholder || "Search..."
    };
};