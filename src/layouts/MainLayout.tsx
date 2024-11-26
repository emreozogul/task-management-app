import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useHeader } from '@/hooks/use-header';

const MainLayout = () => {
    const { shouldShowHeader } = useHeader();

    return (
        <div className="flex h-screen">
            <Sidebar />
            <main className="flex-1 overflow-auto bg-background">
                {shouldShowHeader && <Header />}
                <Outlet />
            </main>
        </div>
    );
};

export default MainLayout;