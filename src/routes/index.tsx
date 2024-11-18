import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { BoardList, Calendar, Dashboard, Documents, DocumentEditor, KanbanBoard, NewBoard, Settings, Widgets } from '@/pages';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout />,
        children: [
            {
                index: true,
                element: <Dashboard />,
            },
            {
                path: 'boards',
                element: <BoardList />,
            },
            {
                path: 'boards/new',
                element: <NewBoard />,
            },
            {
                path: 'boards/:boardId',
                element: <KanbanBoard />,
            },
            {
                path: 'documents',
                element: <Documents />,
            },
            {
                path: 'documents/:documentId',
                element: <DocumentEditor />,
            },

            {
                path: 'widgets',
                element: <Widgets />,
            },
            {
                path: 'settings',
                element: <Settings />,
            },
            {
                path: 'calendar',
                element: <Calendar />,
            },
        ],
    },
]);