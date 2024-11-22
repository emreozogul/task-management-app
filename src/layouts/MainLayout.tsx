import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useHeader } from '@/hooks/use-header';
import { cn } from '../lib/utils';

const MainLayout = () => {
    const { shouldShowHeader } = useHeader();

    return (
        <div className="flex h-screen">
            <Sidebar />
            <main className="flex-1 overflow-auto">
                <Header />
                <main className={cn(
                    "flex-1 overflow-auto",
                    !shouldShowHeader && "pt-0"
                )}>
                    <Outlet />
                </main>
            </main>
        </div>
    );
};

export default MainLayout;