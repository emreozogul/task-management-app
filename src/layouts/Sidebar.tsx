import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Trello, Settings, ChevronLeft, ChevronRight, FileText, Gauge, ListTodo } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/ThemeToggle';

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
        path: '/tasks',
        label: 'Tasks',
        icon: <ListTodo className="w-6 h-6" />,
    },
    {
        path: '/boards',
        label: 'Boards',
        icon: <Trello className="w-6 h-6" />,
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
                "h-full bg-background-secondary text-primary-foreground transition-all duration-500 relative flex flex-col",
                isCollapsed ? "w-16" : "w-48"
            )}
        >
            <nav className="space-y-2 py-4 relative mt-12 flex-1">
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={cn(
                            "flex items-center gap-3 p-3 px-6 border-r-2 border-transparent transition-colors",
                            location.pathname === item.path
                                ? "border-r-primary-foreground text-primary-foreground"
                                : "text-muted hover:bg-background-hover hover:text-primary-foreground",
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

            <div className={cn(
                "p-4 border-t border-border flex items-center",
                isCollapsed ? "justify-center" : "justify-start"
            )}>
                <ThemeToggle />
            </div>

            <button
                type="button"
                title={isCollapsed ? 'Expand' : 'Collapse'}
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="p-1 rounded-full bg-background-hover hover:bg-background-hover-dark transition-colors absolute right-0 top-5 transform -mr-2 z-30"
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