import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Trello, Settings, ChevronLeft, ChevronRight, FileText, Gauge, Calendar } from 'lucide-react';
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
        path: '/boards',
        label: 'Kanbans',
        icon: <Trello className="w-6 h-6" />,
    },
    {
        path: '/calendar',
        label: 'Calendar',
        icon: <Calendar className="w-6 h-6" />,
    },
    {
        path: '/widgets',
        label: 'Widgets',
        icon: <Gauge className="w-6 h-6" />,
    },
    {
        path: '/documents',
        label: 'Documents',
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
                "h-full bg-[#232430] text-white transition-all duration-500 relative",
                isCollapsed ? "w-16" : "w-48"
            )}
        >

            <nav className="space-y-2 py-4 relative">
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={cn(
                            "flex items-center gap-3 p-3 px-6 border-r-2 border-transparent transition-colors",
                            location.pathname === item.path
                                ? "border-r-white text-white"
                                : "text-gray-300 hover:bg-[#383844] hover:text-white",
                            isCollapsed && "justify-center"
                        )}
                        title={isCollapsed ? item.label : undefined}
                    >
                        <div className="flex items-center gap-3">
                            <span className={cn("min-w-[24px]", isCollapsed ? "ml-3" : "ml-0")}>
                                {item.icon}
                            </span>
                            <span
                                className={cn(
                                    "transition-all duration-300 delay-150",
                                    isCollapsed
                                        ? "w-0 opacity-0 overflow-hidden translate-x-[-10px]"
                                        : "w-auto opacity-100 translate-x-0"
                                )}
                            >
                                {item.label}
                            </span>
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