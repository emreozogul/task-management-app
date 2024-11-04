import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

const MainLayout = () => {
    return (
        <div className="flex h-screen">
            <Sidebar />
            {/* Main Content */}
            <main className="flex-1 overflow-auto">

                <Outlet />
            </main>
        </div>
    );
};

export default MainLayout;