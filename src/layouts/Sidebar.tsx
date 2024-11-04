import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Trello, Settings, ChevronLeft, ChevronRight, FileText } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface NavItem {
    path: string;
    label: string;
    icon: JSX.Element;
}

const navItems: NavItem[] = [
    {
        path: '/',
        label: 'Dashboard',
        icon: <LayoutDashboard className="w-6 h-6" />,
    },
    {
        path: '/boards/main',
        label: 'Kanban Board',
        icon: <Trello className="w-6 h-6" />,
    },
    {
        path: '/documents/main',
        label: 'Document Editor',
        icon: <FileText className="w-6 h-6" />,
    },
    {
        path: '/settings',
        label: 'Settings',
        icon: <Settings className="w-6 h-6" />,
    },
];

export const Sidebar = () => {
    const location = useLocation();
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <aside
            className={cn(
                "h-full bg-[#232430] text-white transition-all duration-300 relative",
                isCollapsed ? "w-16" : "w-64"
            )}
        >

            <nav className="space-y-2 p-4 relative">
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={cn(
                            "flex items-center gap-3 p-2 rounded transition-colors",
                            location.pathname === item.path
                                ? "bg-[#383844] text-white"
                                : "text-gray-300 hover:bg-[#383844] hover:text-white",
                            isCollapsed && "justify-center"
                        )}
                        title={isCollapsed ? item.label : undefined}
                    >
                        <div className="flex items-center gap-3">
                            {item.icon}
                            {!isCollapsed && <span>{item.label}</span>}
                        </div>
                    </Link>

                ))}

            </nav>
            <button
                type="button"
                title={isCollapsed ? 'Expand' : 'Collapse'}
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="p-1.5 rounded-full bg-[#383844] hover:bg-[#4e4e59] transition-colors absolute right-0 top-1/2 transform -translate-y-1/2 -mr-4"
            >
                {isCollapsed ? (
                    <ChevronRight className="w-6 h-6" />
                ) : (
                    <ChevronLeft className="w-6 h-6" />
                )}
            </button>
        </aside>
    );
};