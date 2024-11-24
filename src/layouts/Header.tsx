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
        <header className="bg-background-secondary border-b border-border sticky top-0 z-20">
            <div className="px-6 h-16 flex items-center justify-between">
                <nav className="flex items-center space-x-2">
                    <Link
                        to="/"
                        className={cn(
                            "flex items-center text-muted hover:text-primary-foreground transition-colors",
                            pathSegments.length === 0 && "text-primary-foreground"
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
                                <ChevronRight className="w-4 h-4 text-muted" />
                                <Link
                                    to={`/${path}`}
                                    className={cn(
                                        "ml-2 text-sm font-medium",
                                        isLast ? "text-primary-foreground" : "text-muted hover:text-primary-foreground transition-colors"
                                    )}
                                >
                                    {getPageTitle(segment)}
                                </Link>
                            </div>
                        );
                    })}
                </nav>

                <div className="flex items-center space-x-4">
                    {showSearchBar && (
                        <div className="w-48 md:w-72">
                            <Input
                                placeholder={searchPlaceholder}
                                className="bg-background-hover border-border text-primary-foreground"
                                value={searchQuery}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </div>
                    )}

                    {headerActions.map((action, index) => (
                        <Button
                            key={index}
                            onClick={action.onClick}
                            className="bg-primary hover:bg-primary-hover text-primary-foreground"
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