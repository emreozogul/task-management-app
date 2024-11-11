import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Dashboard from '../pages/Dashboard';
import KanbanBoard from '../pages/KanbanBoard';
import Documents from '../pages/Documents';
import DocumentEditor from '../pages/DocumentEditor';
import Settings from '../pages/Settings';
import NewBoard from '../pages/NewBoard';
import BoardList from '../pages/BoardList';
import Widgets from '../pages/Widgets';

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
        ],
    },
]);