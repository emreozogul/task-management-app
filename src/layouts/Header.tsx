import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useHeader } from '@/hooks/use-header';
import { Input } from '@/components/ui/input';

export const Header = () => {
    const {
        shouldShowHeader,
        getPageTitle,
        headerActions,
        showSearchBar,
        searchQuery,
        handleSearch,
        searchPlaceholder
    } = useHeader();
    const location = useLocation();
    const pathSegments = location.pathname.split('/').filter(Boolean);

    if (!shouldShowHeader) return null;

    return (
        <header className="bg-[#232430] border-b border-[#383844] sticky top-0 z-20">
            <div className="px-6 h-16 flex items-center justify-between">
                {/* Breadcrumb */}
                <nav className="flex items-center space-x-2">
                    <Link
                        to="/"
                        className={cn(
                            "flex items-center text-[#95959c] hover:text-white transition-colors",
                            pathSegments.length === 0 && "text-white"
                        )}
                    >
                        <Home className="w-4 h-4" />
                        <span className="ml-2 text-sm font-medium">Dashboard</span>
                    </Link>

                    {pathSegments.map((segment, index) => {
                        const path = pathSegments.slice(0, index + 1).join('/');
                        const isLast = index === pathSegments.length - 1;

                        return (
                            <div key={path} className="flex items-center">
                                <ChevronRight className="w-4 h-4 text-[#95959c]" />
                                <Link
                                    to={`/${path}`}
                                    className={cn(
                                        "ml-2 text-sm font-medium",
                                        isLast ? "text-white" : "text-[#95959c] hover:text-white transition-colors"
                                    )}
                                >
                                    {getPageTitle(segment)}
                                </Link>
                            </div>
                        );
                    })}
                </nav>

                {/* Right Section */}
                <div className="flex items-center space-x-4">
                    {/* Search Bar */}
                    {showSearchBar && (
                        <div className="w-48 md:w-72 ">
                            <Input
                                placeholder={searchPlaceholder}
                                className="bg-[#383844] border-[#4e4e59] text-white"
                                value={searchQuery}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </div>
                    )}

                    {/* Actions */}
                    {headerActions.map((action, index) => (
                        <Button
                            key={index}
                            onClick={action.onClick}
                            className="bg-[#6775bc] hover:bg-[#7983c4] text-white"
                        >
                            {action.icon}
                            {action.label}
                        </Button>
                    ))}
                </div>
            </div>
        </header>
    );
};