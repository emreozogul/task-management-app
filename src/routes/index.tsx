import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import * as Pages from '@/pages';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout />,
        children: [
            {
                index: true,
                element: <Pages.Dashboard />,
            },
            {
                path: 'boards',
                element: <Pages.BoardList />,
            },
            {
                path: 'boards/new',
                element: <Pages.NewBoard />,
            },
            {
                path: 'boards/:boardId',
                element: <Pages.KanbanBoard />,
            },
            {
                path: 'documents',
                element: <Pages.Documents />,
            },
            {
                path: 'documents/:documentId',
                element: <Pages.DocumentEditor />,
            },

            {
                path: 'widgets',
                element: <Pages.Widgets />,
            },
            {
                path: 'settings',
                element: <Pages.Settings />,
            },
            {
                path: 'calendar',
                element: <Pages.Calendar />,
            },
            {
                path: 'tasks',
                element: <Pages.TasksPage />,
            },
            {
                path: 'gantt',
                element: <Pages.Gantt />,
            }
        ],
    },
]);