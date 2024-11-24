import { createContext, useContext, useEffect } from 'react';
import { useThemeStore } from '@/stores/themeStore';

const ThemeProviderContext = createContext({});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const { theme } = useThemeStore();

    useEffect(() => {
        const root = window.document.documentElement;

        if (theme === 'system') {
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            root.classList.toggle('dark', systemTheme === 'dark');

            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            const handler = (e: MediaQueryListEvent) => {
                root.classList.toggle('dark', e.matches);
            };

            mediaQuery.addEventListener('change', handler);
            return () => mediaQuery.removeEventListener('change', handler);
        } else {
            root.classList.toggle('dark', theme === 'dark');
        }
    }, [theme]);

    return (
        <ThemeProviderContext.Provider value={{}}>
            {children}
        </ThemeProviderContext.Provider>
    );
}


export const useTheme = () => {
    if (typeof window === 'undefined') {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return useContext(ThemeProviderContext);
};
